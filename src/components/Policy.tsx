import "./App.css";

function Policy() {
  return (
    <div className="container my-6">
      <h1 className="title has-text-centered mb-5">Privacy & Cookie Policy</h1>

      <div className="box content">
        <p>
          We use cookies only to store your login session token, which enables you to securely access your account and documents.
        </p>

        <p>
          No other cookies or tracking technologies are used. We do not collect any data from your computer or device while you visit our website.
        </p>

        <p>
          Your documents are stored encrypted on our servers, ensuring that only you can access them.
        </p>

        <p>
          In compliance with European Union data protection regulations (GDPR), you have the right to request removal of all your personal data, including emails and documents, at any time.
        </p>

        <p>
          If you wish to exercise this right or have any questions regarding your data, please contact us at <a href="mailto:privacy@example.com">privacy@example.com</a>.
        </p>

        <p className="is-size-7 has-text-grey mt-5">
          By continuing to use our website, you consent to our use of cookies for authentication purposes.
        </p>
      </div>
    </div>
  );
}


export default Policy;
