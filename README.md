# Bank_of_Airlines - American Airlines Group:

# Overview:
We have already built the back-end part of Bank of CLI so now we focus on the front-end side, the "dashboard" aka the web browser stylish stuff.

Project Mission:
To build a modern, professional Single Page Application (SPA). We won't do the back-end for this project (yet) but instead focus creating a high-quality Web-UI thats API ready, which means designing the interface and simulate data response so whenever the real backend arrives in next phase whenever the UI is ready to plug in and go.


# Front-end Experience:
This team is responsible for delivering a reponsive, interactive web dashboard that supports the following user follows:

    - Secure Access: polished login/registration portal.
        - the goal is to handle both successful logins & error states (like invalid credentials) using simulated responses
    - Dashboard: central hub where users can view their current balance and a list of their recent transactions.
    

    - Transaction Center: interactive forms that allow users to perform:
        - deposit 
        - withdraw
        - transfer
        - REQUIRED: forms must include client-side validation (ex: preventing users to enter negative numbers or leaving the field empty)


    - Professional UX (user experience):
        - loading states: shows spinners/"skeletons" loaders when a user performs an action to simulate waiting for a server
        - feedback system: use toast notifactions/pop-up modals to confirm successful actions or alert users to error:


# Architecture & technical requriments:
to guarantee the UI can easiy connect to the backend later, gotta follow a Serivce-Based Architecture. no hard-coding data directly into UI components!
    - 1. Component Layer (the visuals): the UI building blocks (buttons, inputs and cards). they are responsible for looking good and being reusable. RULE: components should NEVER fetch data themselves, they should ask a Service for it.
    - 2. Service Layer (mock engine): the "brains" of the front-end. it handles all data logic and for now, instead of calling a real server, these services will return hardcoded JSON data from a local file.
    - 3. Contract Layer (blueprint): will document exactly what the data "looks like" (the JSON structure). That ensures that once backend team builds the real API, it matches the one in the project.


# Tech Stack:
    - FRAMEWORK: Angular
    - LANGUAGE: TypeScript (to ensure the data models are predictable/error-free)
    - STYLING: CSS3 (tools like: Tailwind, Bootstrap or standard CSS) to cerate a responsive design that works on desktop/mobile
    - DATA SIMULATION: JSON files used by Services to mimic real API reponses
    - VERISON CONTROL: Git & GitHub


# Quality Standards:
    - Reusabilty: build components that can be used in mutliple place (ex: single button component used for both "login" & "transfer")
    - Type Safety: use TypeScript interface for everything (users, account, transaction) to prevent bugs
    - Responsiveness: your application must look professional on all screen size, from large monitors to mobile phones
    - "Contract" Rule: the mocked data must strictly follow the JSON structure we define in the documentation


# Roles assigned:
- Gbola: Auth, Dashboard & Contract Lead:
    - Login and Registration pages w/client-side validation
    - dashboard w/balance and recent transactions
    - CONTRACT LAYER: typescript interface (user, account, transaction) AND API_CONTRACT.md
    - AuthService and AccountService w/mock JSON
    - route guards

- Monzerrat: Transaction Center & Styling Lead;
    - deposit, withdraw and transfer forms w/validation
    - TransactionService w/mock JSON
    -Global styling, design tokens and responsive breakpoints
    - README stylish guide

- Bereket: Setup & Shared UI Lead:
    - Angular project setup, routing, folder structure, branch rules
    - Layout shell (navbar/sidebar)
    - reusable components: button, input, card, modal
    - toast notifactions and spinner/skeleton loaders

# shared resposibilitiess:
- agree on data interface together before bulidng pages
- review at least one teammate's pull request per feature
- test responsiveness on mobile and desktop before merging