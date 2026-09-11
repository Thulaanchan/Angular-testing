using System.Net;
using System.Net.Mail;
using EventParkingReservationSystem.API.Interfaces.Services.Email;

namespace EventParkingReservationSystem.API.Services.Email;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendVerificationEmailAsync(
        string email,
        string displayName,
        string verificationToken)
    {
        var frontendBaseUrl =
            GetRequiredSetting("Frontend:BaseUrl")
                .TrimEnd('/');

        var encodedEmail =
            Uri.EscapeDataString(email);

        var encodedToken =
            Uri.EscapeDataString(verificationToken);

        var verificationUrl =
            $"{frontendBaseUrl}/verify-email" +
            $"?email={encodedEmail}&token={encodedToken}";

        var safeDisplayName =
            WebUtility.HtmlEncode(displayName);

        const string subject =
            "Verify your EventFlow email address";

        var body = $"""
            <html>
            <body>
                <h2>Verify your email</h2>

                <p>Hello {safeDisplayName},</p>

                <p>
                    Thank you for registering with EventFlow.
                    Please verify your email address before signing in.
                </p>

                <p>
                    <a href="{verificationUrl}">
                        Verify Email
                    </a>
                </p>

                <p>
                    If you did not create this account,
                    you can ignore this email.
                </p>
            </body>
            </html>
            """;

        await SendEmailAsync(
            email,
            subject,
            body);
    }

    public async Task SendPasswordResetEmailAsync(
        string email,
        string displayName,
        string resetToken)
    {
        var frontendBaseUrl =
            GetRequiredSetting("Frontend:BaseUrl")
                .TrimEnd('/');

        var encodedEmail =
            Uri.EscapeDataString(email);

        var encodedToken =
            Uri.EscapeDataString(resetToken);

        var resetUrl =
            $"{frontendBaseUrl}/reset-password" +
            $"?email={encodedEmail}&token={encodedToken}";

        var safeDisplayName =
            WebUtility.HtmlEncode(displayName);

        const string subject =
            "Reset your EventFlow password";

        var body = $"""
            <html>
            <body>
                <h2>Reset your password</h2>

                <p>Hello {safeDisplayName},</p>

                <p>
                    We received a request to reset
                    your EventFlow password.
                </p>

                <p>
                    <a href="{resetUrl}">
                        Reset Password
                    </a>
                </p>

                <p>
                    If you did not request a password reset,
                    you can ignore this email.
                </p>
            </body>
            </html>
            """;

        await SendEmailAsync(
            email,
            subject,
            body);
    }

    private async Task SendEmailAsync(
        string recipientEmail,
        string subject,
        string htmlBody)
    {
        var host = _configuration["Smtp:Host"];
        var fromEmail = _configuration["Smtp:FromEmail"];
        var username = _configuration["Smtp:Username"];
        var password = _configuration["Smtp:Password"];

        // If SMTP credentials or sender address are not configured (common in dev/test), do not crash registration
        if (string.IsNullOrWhiteSpace(host) ||
            string.IsNullOrWhiteSpace(fromEmail) ||
            string.IsNullOrWhiteSpace(username) ||
            string.IsNullOrWhiteSpace(password))
        {
            return;
        }

        try
        {
            var port = _configuration.GetValue<int>("Smtp:Port");
            var fromName = _configuration["Smtp:FromName"] ?? "BookWithUs";
            var enableSsl = _configuration.GetValue<bool?>("Smtp:EnableSsl") ?? true;

            if (port <= 0)
            {
                return;
            }

            using var message = new MailMessage
            {
                From = new MailAddress(
                    fromEmail,
                    fromName),

                Subject = subject,

                Body = htmlBody,

                IsBodyHtml = true
            };

            message.To.Add(recipientEmail);

            using var smtpClient =
                new SmtpClient(host, port)
                {
                    EnableSsl = enableSsl,

                    UseDefaultCredentials = false,

                    Credentials =
                        new NetworkCredential(
                            username,
                            password)
                };

            await smtpClient.SendMailAsync(message);
        }
        catch
        {
            // Email transmission errors in development should not abort customer registration
        }
    }

    private string GetRequiredSetting(
        string key)
    {
        return _configuration[key]
            ?? throw new InvalidOperationException(
                $"Required configuration '{key}' is missing.");
    }
}