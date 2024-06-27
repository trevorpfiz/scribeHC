from datetime import datetime, timezone


# Function to parse RFC 3339 datetime and convert to epoch time
def parse_rfc3339(time_str):
    dt = datetime.fromisoformat(time_str.replace("Z", "+00:00"))
    return dt.replace(tzinfo=timezone.utc).timestamp()
