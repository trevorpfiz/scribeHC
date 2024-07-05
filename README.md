<a name="readme-top"></a>

<!-- PROJECT LOGO -->
<br>
<div align="center">
  <a href="https://github.com/trevorpfiz/scribeHC">
    <img src="https://github.com/trevorpfiz/scribeHC/assets/24904780/0e15369e-2550-42da-84ad-0f224af1ac8a" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">scribeHC - AI Ambient Scribe for Healthcare</h3>

  <p align="center">
    This is an open source AI ambient scribe app for healthcare. Record patient-doctor conversations and automatically generate SOAP notes based on the transcripts. Make sure you are HIPAA compliant before using this in a healthcare setting.
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details open>
  <summary><strong>Table of Contents</strong></summary>
  <ol>
    <li>
      <a href="#demo">Demo</a>
    </li>
    <li><a href="#project-details">Project Details</a></li>
    <li><a href="#technical-details">Technical Details</a></li>
    <li>
      <a href="#installation-and-usage">Installation and Usage</a>
    </li>
    <li><a href="#feedback">Feedback</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#references">References</a></li>
  </ol>
</details>

<!-- DEMO -->

## Demo

https://github.com/trevorpfiz/scribeHC/assets/24904780/a1552b10-9694-4d9c-b5fc-ea3b23c91d8d

https://github.com/trevorpfiz/scribeHC/assets/24904780/3feda629-a0d1-4a33-ba63-0c2c14ae1bb4

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT DETAILS -->

## Project Details

### Apps

- **Expo** mobile app for recording patient-doctor conversations.
- **Next.js** dashboard for managing conversations and SOAP notes.
- **FastAPI** for processing audio recordings, generating transcripts, and generating SOAP notes.

### Features

- **Animations:** `react-native-reanimated` for OpenAI-like animations.
- **Authentication:** Sign up with Google, Apple, or email. Clerk components for Next.js, custom components (signin, signup, OTP, password reset) for Expo.
- **Audio Recording:** Record patient-doctor conversations using `expo-av`.
- **Transcripts + SOAP Notes:** Generated in FastAPI using OpenAI APIs.
- **Web Dashboard:** Next.js app for managing SOAP notes.
- **Note Editor:** Edit generated SOAP notes using [novel](https://novel.sh/).

Refer to [building-hipaa-compliant](https://github.com/zacharypfiz/building-hipaa-compliant) for more information on making this project HIPAA compliant.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TECHNICAL DETAILS -->

## Technical Details

### Tech Stack

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [NativeWind](https://www.nativewind.dev/v4/overview)
- [TypeScript](https://www.typescriptlang.org/)
- [tRPC](https://trpc.io/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Clerk](https://clerk.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [SST Ion](https://ion.sst.dev/)
- [Jest](https://jestjs.io/)
- [Testing Library](https://testing-library.com/)
- [Turborepo](https://turbo.build/repo/docs)

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  ├─ Recommended extensions and settings for VSCode users
  └─ Multi-root Workspaces for smoother python experience in monorepo
apps
  ├─ expo
  |   ├─ Expo SDK 51
  |   ├─ React Native using React 18
  |   ├─ Navigation using Expo Router
  |   ├─ Tailwind using NativeWind
  |   ├─ Typesafe API calls using tRPC
  |   └─ Jest + React Native Testing Library for unit tests
  ├─ nextjs
  |   ├─ Next.js 14
  |   ├─ React 18
  |   ├─ Tailwind CSS
  |   └─ E2E Typesafe API Server & Client
  └─ fastapi
      ├─ FastAPI for uploading and processing audio recordings
      ├─ OpenAI Whisper for transcription
      └─ OpenAI Chat Completions API for generating SOAP notes from transcripts
packages
  ├─ api
  |   ├─ tRPC v11 router definition.
  |   └─ Generated TypeScript client from FastAPI OpenAPI spec.
  ├─ db
  |   └─ Typesafe db calls using Drizzle & Amazon RDS
  ├─ ui
  |   └─ shadcn/ui.
  └─ validators
      └─ Zod schemas for repo-wide type-safety and validation.
infra
  └─ SST Ion resources
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  ├─ github
  |   └─ shared github actions
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this project, we use `@shc` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@shc` to something like `@my-company` or `@project-name`.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- INSTALLATION AND USAGE -->

## Installation and Usage

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
cp .env.example .env.local
```

Configure AWS credentials
<https://docs.sst.dev/advanced/iam-credentials#loading-from-a-file>

Install the SST CLI
<https://ion.sst.dev/docs/reference/cli>

```bash
# Run SST Ion (run this in apps/nextjs)
pnpm dev

# Push the Drizzle schema to the RDS database
pnpm db:generate
pnpm db:migrate
```

### 2. Configure Expo `dev`-script

#### Use iOS Simulator

1. Make sure you have XCode and XCommand Line Tools installed [as shown on expo docs](https://docs.expo.dev/workflow/ios-simulator).

   > **NOTE:** If you just installed XCode, or if you have updated it, you need to open the simulator manually once. Run `npx expo start` in the root dir, and then enter `I` to launch Expo Go. After the manual launch, you can run `pnpm dev` in the root directory.

   ```diff
   +  "dev:ios": "expo start --ios",
   ```

2. Run `pnpm dev:ios` at `apps/expo` to open the iOS simulator.

#### Use Android Emulator

1. Install Android Studio tools [as shown on expo docs](https://docs.expo.dev/workflow/android-studio-emulator).

2. Run `pnpm dev:android` script at `apps/expo` to open the Android emulator.

   ```diff
   +  "dev:android": "expo start --android",
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FEEDBACK -->

## Feedback

Share your thoughts in [Discussions](https://github.com/trevorpfiz/scribeHC/discussions)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTRIBUTING -->

## Contributing

We welcome contributions! Find out how you can contribute to the project in `CONTRIBUTING.md`: [Contributing Guidelines](https://github.com/trevorpfiz/scribeHC/blob/main/CONTRIBUTING.md)

<a href="https://github.com/trevorpfiz/scribeHC/graphs/contributors">
  <p align="center">
    <img src="https://contrib.rocks/image?repo=trevorpfiz/scribeHC" alt="A table of avatars from the project's contributors" />
  </p>
</a>

<p align="center">
  Made with <a rel="noopener noreferrer" target="_blank" href="https://contrib.rocks">contrib.rocks</a>
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the [MIT License](https://github.com/trevorpfiz/scribeHC/blob/main/LICENSE). See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- REFERENCES -->

## References

This repo originates from [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo). Feel free to check out the project if you are running into issues with running/deploying the starter.

Thanks as well to the following:

- [next-fast-turbo](https://github.com/cording12/next-fast-turbo) for the learnings on how to bring FastAPI into the project.

- [Build a ChatGPT Clone with React Native](https://youtu.be/8ztx68SUOQo?si=f-HCi6K1qpVX-ATV) by Simon Grimm for the inspiring the direction of the mobile app.

- [Andy AI](https://www.ycombinator.com/companies/andy-ai) for fueling the original idea of this project.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
