# Auth

Use Supabase to authenticate and authorize your users.

Supabase Auth makes it easy to implement authentication and authorization in your app. We provide client SDKs and API endpoints to help you create and manage users.

Your users can use many popular Auth methods, including password, magic link, one-time password (OTP), social login, and single sign-on (SSO).

## About authentication and authorization

Authentication and authorization are the core responsibilities of any Auth system.

- **Authentication** means checking that a user is who they say they are.
- **Authorization** means checking what resources a user is allowed to access.

Supabase Auth uses [JSON Web Tokens (JWTs)](https://supabase.com/docs/guides/auth/jwts) for authentication. For a complete reference of all JWT fields, see the [JWT Fields Reference](https://supabase.com/docs/guides/auth/jwt-fields). Auth integrates with Supabase's database features, making it easy to use [Row Level Security (RLS)](https://supabase.com/docs/guides/database/postgres/row-level-security) for authorization.

## The Supabase ecosystem

You can use Supabase Auth as a standalone product, but it's also built to integrate with the Supabase ecosystem.

Auth uses your project's Postgres database under the hood, storing user data and other Auth information in a special schema. You can connect this data to your own tables using triggers and foreign key references.

Auth also enables access control to your database's automatically generated [REST API](https://supabase.com/docs/guides/api). When using Supabase SDKs, your data requests are automatically sent with the user's Auth Token. The Auth Token scopes database access on a row-by-row level when used along with [RLS policies](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Get started

Start here if you're new to Supabase Auth:

- **[Auth with email and password](https://supabase.com/docs/guides/auth/passwords):** Sign up and sign in users with email and password.
- **[Server-side rendering](https://supabase.com/docs/guides/auth/server-side):** Create a Supabase client for SSR frameworks like Next.js and SvelteKit.
- **[Which package to use](https://supabase.com/docs/guides/auth/choosing-a-server-package):** supabase-js vs @supabase/ssr vs @supabase/server — which to use on the server.
- **[Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security):** Use RLS policies to authorize data access from the client.

## Providers

Supabase Auth works with many popular Auth methods, including Social and Phone Auth using third-party providers. See the following sections for a list of supported third-party providers.

### Social Auth

- [Apple](/docs/guides/auth/social-login/auth-apple)
- [Azure (Microsoft)](/docs/guides/auth/social-login/auth-azure)
- [Bitbucket](/docs/guides/auth/social-login/auth-bitbucket)
- [Discord](/docs/guides/auth/social-login/auth-discord)
- [Facebook](/docs/guides/auth/social-login/auth-facebook)
- [Figma](/docs/guides/auth/social-login/auth-figma)
- [GitHub](/docs/guides/auth/social-login/auth-github)
- [GitLab](/docs/guides/auth/social-login/auth-gitlab)
- [Google](/docs/guides/auth/social-login/auth-google)
- [Kakao](/docs/guides/auth/social-login/auth-kakao)
- [Keycloak](/docs/guides/auth/social-login/auth-keycloak)
- [LinkedIn](/docs/guides/auth/social-login/auth-linkedin)
- [Notion](/docs/guides/auth/social-login/auth-notion)
- [Slack](/docs/guides/auth/social-login/auth-slack)
- [Spotify](/docs/guides/auth/social-login/auth-spotify)
- [Twitter](/docs/guides/auth/social-login/auth-twitter)
- [Twitch](/docs/guides/auth/social-login/auth-twitch)
- [WorkOS](/docs/guides/auth/social-login/auth-workos)
- [Zoom](/docs/guides/auth/social-login/auth-zoom)

Note: You can also add any OAuth2 or OIDC-compatible identity provider using [Custom OAuth/OIDC Providers](https://supabase.com/docs/guides/auth/custom-oauth-providers).

### Phone Auth

- [MessageBird](/docs/guides/auth/phone-login?showSmsProvider=MessageBird)
- [Twilio](/docs/guides/auth/phone-login?showSmsProvider=Twilio)
- [Vonage](/docs/guides/auth/phone-login?showSmsProvider=Vonage)

## Pricing

Charges apply to Monthly Active Users (MAU), Monthly Active Third-Party Users (Third-Party MAU), and Monthly Active SSO Users (SSO MAU) and Advanced MFA Add-ons. For a detailed breakdown of how these charges are calculated, refer to the following pages.

- **[Pricing MAU](https://supabase.com/docs/guides/platform/manage-your-usage/monthly-active-users):** How MAU usage is measured and billed.
- **[Pricing Third-Party MAU](https://supabase.com/docs/guides/platform/manage-your-usage/monthly-active-users-third-party):** How third-party auth MAU is measured and billed.
- **[Pricing SSO MAU](https://supabase.com/docs/guides/platform/manage-your-usage/monthly-active-users-sso):** How SSO MAU usage is measured and billed.
- **[Advanced MFA - Phone](https://supabase.com/docs/guides/platform/manage-your-usage/advanced-mfa-phone):** How Advanced MFA Phone add-on usage is measured and billed.

## Next steps

Once you've covered the basics, these guides help with other use cases and features:

- **[Email (Magic link or OTP)](https://supabase.com/docs/guides/auth/auth-email-passwordless):** Sign up and sign in users with a Magic Link or email OTP instead of a password.
- **[Enterprise SSO](https://supabase.com/docs/guides/auth/enterprise-sso):** Add Single Sign-On for enterprise applications with SAML 2.0.
- **[User sessions](https://supabase.com/docs/guides/auth/sessions):** Control session lifetime, refresh tokens, and multi-device sign-in behavior.
- **[Third-party auth](https://supabase.com/docs/guides/auth/third-party/overview):** Use Clerk, Auth0, Firebase Auth, Cognito, or WorkOS JWTs with Supabase APIs.
- **[Multi-factor authentication](https://supabase.com/docs/guides/auth/auth-mfa):** Add a second factor to user sign-in with TOTP or phone.
- **[JWTs](https://supabase.com/docs/guides/auth/jwts):** Understand how Supabase Auth issues and validates JWTs.
- **[Auth Hooks](https://supabase.com/docs/guides/auth/auth-hooks):** Customize Auth behavior with Postgres functions at key lifecycle points.
