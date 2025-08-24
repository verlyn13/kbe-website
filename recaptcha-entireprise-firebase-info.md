
# **An Exhaustive Guide to Domain Authorization for Firebase App Check with reCAPTCHA Enterprise**

## ⚠️ IMPORTANT UPDATE: App Check OAuth Incompatibility

**Critical Issue**: Firebase App Check in "Enforce" mode is incompatible with OAuth authentication providers (Google, Facebook, etc.). Even with proper domain configuration, OAuth flows will fail with `auth/internal-error`.

**Current Solution**: App Check must be set to "Unenforced" mode for Authentication and Firestore APIs when using OAuth providers.

See `APP_CHECK_OAUTH_ISSUE.md` for full details.

---

## **Introduction**

The protection of backend resources from abuse, fraud, and unauthorized access is a paramount concern in modern web application architecture. Firebase App Check, in conjunction with the reCAPTCHA Enterprise provider, offers a robust framework to address this challenge. This integrated solution ensures that requests targeting backend services—such as Cloud Firestore, Cloud Functions, and Cloud Storage—originate from a legitimate, untampered instance of a client application. At the core of this security model is the principle of attestation, where the client application proves its authenticity to backend services by presenting a valid token.  
reCAPTCHA Enterprise serves as the attestation provider, leveraging Google's advanced risk analysis engine to distinguish between legitimate users and automated bots. Firebase App Check orchestrates this process, exchanging the short-lived reCAPTCHA token for a longer-lived App Check token that is transparently sent with every backend request. A critical, yet often misunderstood, component of this setup is the correct configuration of domain authorization within the reCAPTCHA Enterprise key. This control is the primary mechanism that binds a reCAPTCHA key to a specific web property, preventing its unauthorized use on malicious sites.  
This report provides an exhaustive, expert-level guide to the complete process of authorizing domains for Firebase App Check using reCAPTCHA Enterprise, based on official Google Cloud documentation. It will cover the foundational security principles, the detailed architecture of the token exchange flow, and the necessary prerequisites for a successful implementation. The report will then present two distinct configuration pathways—direct key management and automated management via Identity Platform—highlighting the critical differences between them. Finally, it will delve into verification strategies, advanced topics, and known edge cases to provide a comprehensive operational playbook for cloud engineers and senior developers.  
---

## **Section 1: Foundational Principles and Prerequisites**

A successful and secure implementation of Firebase App Check with reCAPTCHA Enterprise hinges on a clear understanding of the underlying security principles and a thorough check of all prerequisites. Attempting configuration without this foundational knowledge often leads to implementation errors, security vulnerabilities, or unexpected operational costs.

### **1.1 The Security Imperative of Domain Validation**

Domain validation is not merely a configuration setting; it is a fundamental security control that underpins the integrity of the reCAPTCHA Enterprise system. A reCAPTCHA Enterprise site key is a credential that grants the ability to generate attestation tokens. If this key were to be compromised and used on an attacker's domain, it could be used to generate valid tokens to abuse services, bypass security controls, or exhaust API quotas, all while being attributed to the legitimate project.1  
The mechanism of domain validation directly mitigates this risk. When enabled, it instructs Google's reCAPTCHA servers to process token generation requests only if they originate from a domain on a pre-approved allowlist. This effectively binds the power of the site key to the developer's legitimate web properties. Any attempt to use the key on an unauthorized domain will be rejected by the reCAPTCHA service, rendering the stolen key useless to an attacker.2  
Disabling domain verification is explicitly designated as a significant security risk. While the option exists for scenarios where the list of domains is exceptionally long or dynamic, it fundamentally shifts the security burden from Google's managed infrastructure to the developer's own backend.2 In such cases, the developer is  
*required* to implement server-side checks to validate the hostname from which the token originated and reject any requests from unexpected sources. Failure to implement this server-side check leaves the key, and by extension the application, vulnerable to hijacking.2 For most applications, and especially for those integrating with Firebase App Check, domain validation should remain enabled. This principle extends to all environments; for instance, development work requires adding  
localhost to the list of authorized domains to ensure functionality.2

### **1.2 System Architecture and Token Exchange Flow**

To effectively configure and troubleshoot the integration, it is essential to have a precise mental model of the entire token exchange process. This is not a single client-to-backend call but a multi-step orchestration managed by the Firebase App Check SDK.

1. **Client-Side Initialization:** When a user visits the web application, the browser loads the necessary JavaScript. The application's code initializes the Firebase App Check SDK, configuring it to use the ReCaptchaEnterpriseProvider and providing the public reCAPTCHA Enterprise site key.3  
2. **Initial Attestation (Token Request):** The App Check SDK makes a call to the reCAPTCHA Enterprise grecaptcha.enterprise.execute() function. This triggers reCAPTCHA's risk analysis. If the request originates from an authorized domain, Google's servers return a short-lived, single-use reCAPTCHA token to the client.4  
3. **Token Exchange:** The App Check SDK immediately takes this reCAPTCHA token and sends it to a dedicated Firebase App Check backend service.5  
4. **Backend Assessment:** Acting on behalf of the developer's project, the Firebase App Check service calls the reCAPTCHA Enterprise projects.assessments.create API endpoint. It passes along the reCAPTCHA token to be assessed for validity and risk. This server-to-server call validates the token's authenticity and returns a risk score.4  
5. **App Check Token Issuance:** If the assessment confirms the reCAPTCHA token is valid and the risk score is acceptable, the Firebase App Check service generates, signs, and returns a new, longer-lived App Check token to the client SDK. The validity period of this token is defined by a configurable Time-to-Live (TTL).3  
6. **Authenticated Backend Requests:** From this point forward, whenever the client application makes a request to a protected Firebase service (e.g., a Firestore read or a Cloud Function call), the App Check SDK automatically attaches the valid App Check token to the request headers.3  
7. **Backend Verification:** The receiving Firebase backend service (e.g., the Cloud Functions runtime) uses the Firebase Admin SDK to verify the App Check token. This verification is performed locally by checking the token's cryptographic signature against public keys fetched from Firebase servers. This is highly efficient as it does not require a network call to an external service for every single request.5  
8. **Token Refresh:** The client SDK proactively manages the token's lifecycle. To ensure a seamless user experience without interruptions, the SDK is designed to automatically re-initiate the entire attestation and exchange process (steps 2-5) when the current App Check token reaches approximately 50% of its TTL.5

This token exchange architecture has a subtle but critical implication for both cost and performance. Since reCAPTCHA Enterprise billing is based on the number of assessments created, and the App Check SDK refreshes the token at roughly twice the frequency implied by the TTL, the actual number of billable assessments per user session is effectively doubled.3 For example, a 1-hour TTL results in an assessment approximately every 30 minutes. This "eager refresh" behavior must be factored into any cost estimation and performance analysis, as each attestation cycle introduces a small amount of latency.6 The choice of TTL is therefore not just a security decision but a direct control over operational costs and application responsiveness.

### **1.3 Pre-flight Checklist: Essential APIs and IAM Permissions**

Before proceeding with any configuration, it is imperative to ensure that the necessary APIs are enabled and the correct Identity and Access Management (IAM) permissions are granted to the relevant user or service accounts. Failure to do so is a common source of permission-denied errors.  
First, the reCAPTCHA Enterprise API itself must be enabled for the Google Cloud project. This can be accomplished through the Google Cloud Console's API Library or via the gcloud command-line interface. The service name to enable is recaptchaenterprise.googleapis.com.3  
Second, specific IAM roles are required to perform different actions related to reCAPTCHA Enterprise and Firebase App Check. Granting roles that are either insufficient or overly permissive can lead to operational failures or security risks. The table below outlines the essential roles and their use cases in this context.

| Role Name | Identifier | Granted Permissions & Use Case |
| :---- | :---- | :---- |
| reCAPTCHA Enterprise Admin | roles/recaptchaenterprise.admin | Full control over reCAPTCHA keys. **Required to create new keys and edit the authorized domains of existing keys.** 8 |
| reCAPTCHA Enterprise Viewer | roles/recaptchaenterprise.viewer | Read-only access. Allows viewing key configurations and monitoring dashboards. Useful for operations or security teams. 9 |
| reCAPTCHA Enterprise Agent | roles/recaptchaenterprise.agent | Permission to create assessments. Typically granted to service accounts that verify reCAPTCHA tokens on the backend. 4 |
| Firebase Admin | roles/firebase.admin | Full control over the Firebase project, including App Check settings. Required to register an app with App Check in the Firebase console. |

---

## **Section 2: Primary Configuration: Direct Management of reCAPTCHA Enterprise Keys**

This section details the most common and direct method for configuring domain authorization: creating and managing a reCAPTCHA Enterprise key specifically for use with Firebase App Check. This approach provides granular control and is the standard procedure for new integrations.

### **2.1 Step-by-Step Guide to Creating an App Check-Compatible reCAPTCHA Enterprise Key**

Creating a key with the correct settings is the foundational step. An incorrectly configured key will cause the App Check integration to fail.

1. Navigate to the **reCAPTCHA** page in the Google Cloud Console.  
2. At the top of the page, click **Create key**.  
3. In the **Display name** field, enter a descriptive label, such as "WebApp Production App Check Key".  
4. For **Application type**, select **Web**. This is a mandatory selection for web-based App Check.1  
5. In the **Domain list** section, click **Add a domain** and enter the initial set of domains where the application will be hosted. It is important to note that specifying a root domain (e.g., example.com) will automatically include all its subdomains (e.g., www.example.com, app.example.com).1  
6. Crucially, leave the **Use checkbox challenge** option **unselected**. Firebase App Check relies on the "invisible," score-based assessment flow of reCAPTCHA Enterprise. Selecting the checkbox option creates a key that expects a different user interaction model and is incompatible with the App Check provider.3  
7. In the **Additional settings** section, ensure the toggle for **Will you deploy this key in a Web Application Firewall (WAF)?** is turned **off**. This setting is specifically for integration with services like Google Cloud Armor and alters the key's behavior in a way that is not intended for a standard App Check setup.1  
8. Click **Create key**.

The result of this process is a new reCAPTCHA Enterprise **Site Key**. This is a public key that will be embedded in the client-side JavaScript application. It is distinct from a secret key and is designed to be publicly visible.6 The UI presents several options during key creation that can be easily misconfigured. The "checkbox challenge" and "WAF" toggles are prime examples of settings that, if enabled incorrectly, will lead to integration failures that can be difficult to diagnose. The App Check provider is specifically coded to expect a score-only, non-WAF key, and providing a key of a different type will break the token exchange flow during the backend assessment step.

### **2.2 Core Procedure: Modifying Authorized Domains on an Existing Key**

To add or remove domains from an already existing key—the central task of this report—the following procedure should be followed. This action requires the user to have the reCAPTCHA Enterprise Admin IAM role.8

1. Navigate to the **reCAPTCHA** page in the Google Cloud Console.  
2. Verify that the correct Google Cloud project is selected in the resource selector at the top of the page.  
3. In the list of **reCAPTCHA keys**, identify the specific key that needs to be modified.  
4. Click the more\_vert (three vertical dots) icon at the end of the row for that key to open the action menu.  
5. Select **Edit key** from the menu.8  
6. This will open the **Edit the reCAPTCHA key** page. Scroll down to the **Domain list** section.  
7. To authorize a new domain, click the **Add a domain** button and type the fully qualified domain name into the new field.1  
8. To de-authorize a domain, click the trash can icon next to the domain entry you wish to remove.  
9. After making all necessary changes, click the **Update key** button at the bottom of the page to save the new configuration.8

It is important to be aware of a key limitation: the platform type of a key (e.g., Web, Android, iOS) is immutable and cannot be changed after creation. If a key was mistakenly created for the wrong platform, a new key must be created.8

### **2.3 Integrating the Site Key with Firebase App Check**

Once the reCAPTCHA Enterprise key is correctly configured with the desired domains, it must be linked to the specific web app within the Firebase project.

1. Open the Firebase Console and navigate to the correct project.  
2. In the left-hand navigation pane, under the **Build** section, click on **App Check**.  
3. Select the **Apps** tab to view a list of applications registered with the project.  
4. Find the target web application in the list and click on its name.  
5. In the attestation providers section, click on **reCAPTCHA Enterprise**.  
6. A dialog will appear prompting for the **Site Key**. Paste the reCAPTCHA Enterprise site key that was created or edited in the previous steps.3  
7. In this same dialog, the **Token time-to-live (TTL)** can be configured. This setting dictates the lifespan of the App Check tokens issued to clients. The value can range from 30 minutes to 7 days. As discussed previously, this setting has direct implications for security, performance, and cost.3 A shorter TTL enhances security by reducing the window for token abuse but increases the frequency of re-attestation, potentially impacting performance and raising costs.  
8. Click **Save** to complete the integration.

### **2.4 Client-Side Implementation and Initialization**

The final step is to integrate the Firebase App Check SDK into the client-side web application and initialize it with the site key.  
First, ensure the necessary Firebase libraries are included in the project, typically via npm for modern JavaScript frameworks or via script tags for simpler pages.3  
Next, add the initialization code to the application. This code must execute *before* any other Firebase service (like Firestore, Authentication, or Functions) is used, to ensure that all outgoing requests are properly signed with an App Check token.3  
The following is an example using the modern ES Module syntax:

JavaScript

import { initializeApp } from "firebase/app";  
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "firebase/app-check";

// Your web app's Firebase configuration  
const firebaseConfig \= {  
  apiKey: "...",  
  authDomain: "...",  
  projectId: "...",  
  //...  
};

// Initialize Firebase  
const app \= initializeApp(firebaseConfig);

// Initialize App Check  
const appCheck \= initializeAppCheck(app, {  
  provider: new ReCaptchaEnterpriseProvider('YOUR\_RECAPTCHA\_ENTERPRISE\_SITE\_KEY'),  
  isTokenAutoRefreshEnabled: true  
});

The isTokenAutoRefreshEnabled: true parameter is highly recommended. When set to true, the SDK will automatically handle the token refresh process in the background, ensuring that the user's session is not interrupted when the App Check token expires.3 If this is set to false or omitted, manual token management is required, which can add significant complexity.  
---

## **Section 3: Alternative Configuration Path via Identity Platform**

A common point of confusion arises when an application uses Google Cloud Identity Platform (GCIP) for user authentication. GCIP offers its own integrated reCAPTCHA bot protection feature, which automates key management. The process for authorizing domains in this scenario is fundamentally different, and attempting to use the direct management method described in Section 2 can break the integration.

### **3.1 Context and Use Case**

This alternative configuration path is applicable *only* if the application is using Identity Platform for authentication flows (such as email/password sign-in or multi-factor authentication) and has explicitly enabled the reCAPTCHA bot protection feature within the Identity Platform settings.10  
In this mode, Identity Platform automatically provisions one or more reCAPTCHA Enterprise keys within the project on the developer's behalf. These keys are identifiable by their display names, which typically follow the pattern Key for Identity Platform integration with reCAPTCHA.10 The management of these keys is handled by the Identity Platform service itself.

### **3.2 Procedure for Domain Authorization in Identity Platform**

When using GCIP-managed reCAPTCHA, domain authorization is not performed by editing the reCAPTCHA key directly. Instead, it is configured within the Identity Platform settings, which then propagates the changes to the managed key.

1. In the Google Cloud Console, navigate to the **Identity Platform** page.  
2. In the left-hand navigation pane, go to **Settings**, then select the **Security** tab.10  
3. Locate the **Authorized Domains** card on this page.  
4. Click the **Add domain** button.  
5. Enter the domain name that needs to be authorized and click **Add** to save the change.10

Identity Platform will then handle the process of updating its managed reCAPTCHA key with the new domain.

### **3.3 Critical Caveats for Managed Keys**

The separation of management interfaces for reCAPTCHA keys creates a significant risk of misconfiguration. The Google Cloud Console presents two distinct "control planes" for what appears to be the same resource: the reCAPTCHA console for direct key editing and the Identity Platform console for managing authorized domains. A developer who is using Identity Platform but follows a general guide for editing reCAPTCHA keys may inadvertently corrupt their setup.  
The official documentation provides a stark warning that must be heeded: **Do not edit or delete reCAPTCHA keys named Key for Identity Platform integration with reCAPTCHA** directly from the reCAPTCHA console unless the integration is fully disabled. Manually altering these keys will sever the link between the Identity Platform service and its managed resource, which can cause the bot protection feature to fail, either by blocking all users or failing open.10  
Furthermore, the relationship is exclusive. Identity Platform's SDKs are designed to work only with the keys they manage and **cannot generate tokens from reCAPTCHA keys that you generate on your own**.10 This means a manually created key cannot be retrofitted for use with GCIP's automated bot protection. The choice of which path to follow must be made consciously based on whether the application relies on Identity Platform's integrated security features.  
---

## **Section 4: Verification, Advanced Topics, and Best Practices**

Configuration is only the first step. A professional deployment requires a strategy for verification, rollout, and handling of non-standard scenarios. A "configure and deploy" approach is fraught with risk; a more mature "monitor, analyze, and enforce" lifecycle is the recommended best practice.

### **4.1 Monitoring and Enforcement Strategy**

Immediately enabling enforcement after deployment is highly discouraged. A misconfiguration in the client-side code, the reCAPTCHA key, or the domain authorization list could result in legitimate users being blocked from accessing backend services, effectively causing a production outage.  
The recommended rollout strategy is a phased approach:

1. **Monitor:** Deploy the client application with the App Check SDK integrated, but keep enforcement turned **off** in the Firebase Console. In this state, the client app will send App Check tokens, and the backend will track their validity, but it will not reject requests with invalid or missing tokens.3  
2. **Analyze:** Allow the application to run in this monitoring mode while collecting data. Review the metrics available in two key locations:  
   * **Firebase App Check Console:** The metrics dashboard here will show a breakdown of requests categorized as "Verified," "Unverified," and "Outdated Client." The goal is to see the vast majority of legitimate user traffic appearing in the "Verified" category. A high volume of "Unverified" requests indicates a potential configuration issue that must be investigated.3  
   * **reCAPTCHA Enterprise Console:** The dashboard for the specific key provides insights into the risk score distribution of assessments. This can help confirm that the key is receiving traffic and that the risk engine is evaluating it as expected.9  
3. **Enforce:** Only after the monitoring data confirms that legitimate traffic is consistently passing attestation and receiving verified tokens should enforcement be enabled. In the Firebase App Check console, under the **Apps** tab, select the service (e.g., Cloud Firestore) and click the **Enforce** button.3 This can be done on a per-service basis, allowing for a gradual rollout of protection.

### **4.2 Configuration Nuances: Propagation Time and Token TTL**

Two subtle but important configuration details can impact troubleshooting and system design.  
First, changes to authorized domains are not instantaneous. Whether a domain is added by editing a key directly or through the Identity Platform settings, the documentation notes that **reCAPTCHA key provisioning can take several minutes to complete**.10 When testing a newly added domain, a developer who observes immediate failures might incorrectly assume the configuration is wrong, when in fact the changes have not yet fully propagated through Google's infrastructure. It is advisable to wait for a short period before re-testing after a domain change.  
Second, the choice of the App Check Token TTL involves a crucial trade-off between security, performance, and cost. The following table summarizes these dynamics to aid in making an informed architectural decision.

| TTL Setting | Security Posture | Performance Impact | Cost Impact | Recommended Use Case |
| :---- | :---- | :---- | :---- | :---- |
| Short (e.g., 30 mins) | Higher (smaller window for token abuse) | Higher (frequent attestation latency) | Higher (more assessments) | High-security, low-volume endpoints (e.g., payment processing). |
| Default (e.g., 1 day) | Balanced | Balanced | Balanced | Most general-purpose applications. 6 |
| Long (e.g., 7 days) | Lower (larger window for token abuse) | Lower (infrequent attestation latency) | Lower (fewer assessments) | Low-risk applications where performance and cost are primary concerns. |

### **4.3 Edge Case Analysis: Integration with Cloud Armor WAF**

A significant edge case arises when attempting to integrate reCAPTCHA Enterprise with Google Cloud Armor, the Web Application Firewall (WAF). Community-sourced operational knowledge has revealed a critical limitation in this specific integration: the Cloud Armor rule that validates the reCAPTCHA token will not be triggered correctly if domain validation is enabled on the reCAPTCHA key.11  
This forces a difficult choice between two powerful security controls: WAF-level bot mitigation and key-level domain restriction. To make the Cloud Armor integration work, developers are currently required to disable domain verification on the reCAPTCHA key, re-introducing the risk of key hijacking discussed in Section 1\.11  
A viable mitigation strategy exists within Cloud Armor itself. Instead of relying on reCAPTCHA's built-in domain check, a developer can create a compound WAF rule that first verifies the request's Host header before proceeding to evaluate the reCAPTCHA token. For example, a rule could be structured to match request.headers\['host'\].matches('www.example.com') in addition to checking the token. This effectively performs domain validation at the WAF layer, partially compensating for it being disabled at the reCAPTCHA layer.11 This is a crucial detail that is not prominently featured in the official documentation, highlighting the importance of synthesizing information from multiple sources when dealing with complex cloud integrations.

## **Conclusion**

Authorizing a domain for Firebase App Check with reCAPTCHA Enterprise is a process with critical security implications that extend beyond simply adding a name to a list. A successful implementation requires a clear understanding of the foundational security principles, a precise model of the token exchange architecture, and careful navigation of the Google Cloud and Firebase consoles.  
The analysis reveals several key conclusions:

* **Domain validation is a non-negotiable security control.** Disabling it should be considered an exception only for highly specialized use cases and requires implementing compensatory server-side checks. For the vast majority of App Check integrations, it must remain enabled.  
* **The token exchange flow dictates cost and performance.** The "eager refresh" behavior of the App Check SDK means that the configured Token TTL has a direct and doubled impact on the number of billable reCAPTCHA assessments and the frequency of latency-inducing attestation events. This trade-off must be a conscious architectural decision.  
* **Google Cloud's "dual control planes" for reCAPTCHA management create a significant risk of misconfiguration.** The separate configuration paths for direct key management versus Identity Platform-managed keys are a potential pitfall. Developers must correctly identify which context applies to their application to avoid breaking their security posture.  
* **A phased, data-driven rollout is the only safe path to enforcement.** The "Monitor, Analyze, Enforce" strategy, using the metrics available in both the Firebase and reCAPTCHA consoles, is essential for deploying App Check without risking a service disruption for legitimate users.

By following the detailed procedures and heeding the warnings outlined in this report, engineers can confidently and securely implement domain authorization, thereby strengthening their application's defense against automated threats and ensuring the integrity of their backend services.

#### **Works cited**

1. Integrate with Google Cloud Armor for websites | reCAPTCHA Enterprise, accessed August 24, 2025, [https://cloud.google.com/recaptcha/docs/implement-waf-ca](https://cloud.google.com/recaptcha/docs/implement-waf-ca)  
2. Domain/Package Name Validation | reCAPTCHA | Google for ..., accessed August 24, 2025, [https://developers.google.com/recaptcha/docs/domain\_validation](https://developers.google.com/recaptcha/docs/domain_validation)  
3. Get started using App Check with reCAPTCHA Enterprise in web ..., accessed August 24, 2025, [https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider](https://firebase.google.com/docs/app-check/web/recaptcha-enterprise-provider)  
4. Create assessments for websites | reCAPTCHA Enterprise \- Google Cloud, accessed August 24, 2025, [https://cloud.google.com/recaptcha/docs/create-assessment-website](https://cloud.google.com/recaptcha/docs/create-assessment-website)  
5. Firebase App Check and reCAPTCHA v3 Enterprise Integration: Billing and Token Reusability \- Stack Overflow, accessed August 24, 2025, [https://stackoverflow.com/questions/76461078/firebase-app-check-and-recaptcha-v3-enterprise-integration-billing-and-token-re](https://stackoverflow.com/questions/76461078/firebase-app-check-and-recaptcha-v3-enterprise-integration-billing-and-token-re)  
6. Get started using App Check with reCAPTCHA v3 in web apps \- Firebase, accessed August 24, 2025, [https://firebase.google.com/docs/app-check/web/recaptcha-provider](https://firebase.google.com/docs/app-check/web/recaptcha-provider)  
7. google\_firebase\_app\_check\_rec, accessed August 24, 2025, [https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firebase\_app\_check\_recaptcha\_enterprise\_config](https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/firebase_app_check_recaptcha_enterprise_config)  
8. Edit or delete reCAPTCHA keys | reCAPTCHA Enterprise | Google ..., accessed August 24, 2025, [https://cloud.google.com/recaptcha/docs/manage-keys](https://cloud.google.com/recaptcha/docs/manage-keys)  
9. Monitor reCAPTCHA keys | reCAPTCHA Enterprise | Google Cloud, accessed August 24, 2025, [https://cloud.google.com/recaptcha/docs/monitor-keys](https://cloud.google.com/recaptcha/docs/monitor-keys)  
10. Integrate Identity Platform with the reCAPTCHA Enterprise API \- Google Cloud, accessed August 24, 2025, [https://cloud.google.com/identity-platform/docs/recaptcha-enterprise](https://cloud.google.com/identity-platform/docs/recaptcha-enterprise)  
11. Cloud Armor \+ Recaptcha with domain validation \- Stack Overflow, accessed August 24, 2025, [https://stackoverflow.com/questions/76229084/cloud-armor-recaptcha-with-domain-validation](https://stackoverflow.com/questions/76229084/cloud-armor-recaptcha-with-domain-validation)
