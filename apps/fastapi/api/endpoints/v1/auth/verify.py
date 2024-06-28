import logging
from datetime import datetime, timezone
from typing import Optional, List

import requests
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import exceptions, jwk, jwt
from jose.utils import base64url_decode

from api.config import settings

if settings.ENVIRONMENT == "development":
    logging.basicConfig(level=logging.DEBUG)
else:
    logging.basicConfig(level=logging.WARNING)

ALGORITHM = "RS256"
security = HTTPBearer()

# Define the allowed origins for the azp claim
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "com.scribehc.app",
]

def get_jwks(jwks_url: str):
    """Fetch the JWKS from the given URL."""
    response = requests.get(jwks_url)
    response.raise_for_status()
    return response.json()


def get_public_key(token: str, jwks_url: str):
    """Get the public key for the given token from the JWKS."""
    jwks = get_jwks(jwks_url)
    header = jwt.get_unverified_header(token)
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"],
            }
            break
    if not rsa_key:
        raise HTTPException(status_code=401, detail="Unable to find appropriate key")
    return jwk.construct(rsa_key, algorithm=ALGORITHM)


def decode_jwt(token: str, jwks_url: str, allowed_origins: List[str]) -> Optional[dict]:
    """Decode a JWT token and verify its expiration and azp claim using JWKS."""
    try:
        logging.info("Attempting to decode the JWT token.")
        public_key = get_public_key(token, jwks_url)
        message, encoded_signature = token.rsplit(".", 1)
        decoded_signature = base64url_decode(encoded_signature.encode("utf-8"))

        if not public_key.verify(message.encode("utf-8"), decoded_signature):
            logging.warning("Invalid token signature.")
            return None

        payload = jwt.decode(
            token,
            public_key.to_pem().decode("utf-8"),
            algorithms=[ALGORITHM],
            audience="authenticated",
        )

        # Validate expiration (exp) and not before (nbf) claims
        now = datetime.now(tz=timezone.utc)
        exp = payload.get("exp")
        nbf = payload.get("nbf")

        if exp and datetime.fromtimestamp(exp, tz=timezone.utc) < now:
            logging.warning("Token has expired.")
            return None

        if nbf and datetime.fromtimestamp(nbf, tz=timezone.utc) > now:
            logging.warning("Token not yet valid.")
            return None

        # Validate authorized parties by the azp claim
        azp = payload.get("azp")
        logging.debug(f"azp: {azp}")

        if azp and azp not in allowed_origins:
            logging.warning(f"Unauthorized party: {azp}")
            return None

        logging.info("JWT successfully decoded.")
        return payload

    except exceptions.ExpiredSignatureError:
        logging.error("JWT has expired.")
        return None
    except exceptions.JWTClaimsError:
        logging.error("JWT claims error.")
        return None
    except exceptions.JWTError as e:
        logging.error(f"JWT decoding error: {e}")
        return None


def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Verify the incoming token using the `decode_jwt` function."""
    token = credentials.credentials

    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    payload = decode_jwt(token, settings.CLERK_JWKS_URL, ALLOWED_ORIGINS)
    if not payload or "sub" not in payload:
        raise credentials_exception

    return payload["sub"]
