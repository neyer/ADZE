export function ErrorMessageOrNull ({errorMessage}) {
  if (typeof errorMessage === "undfined" || errorMessage == null || errorMessage === "") {
    return null;
  }
  return (
        <div className="notification is-error">
          {errorMessage}
        </div>
  );
}

export function ManifestStatusMessage ({credentials}) {
  if (credentials.manifestUrl  !== "") {
    return (
        <div className="notification is-success">
          Your manifest is visible on the web at:
          <a href={credentials.manifestUrl}> {credentials.manifestUrl}</a>
        </div>
    );
  }
  return (
        <div className="notification is-warning">
          You'll need to create credentials for an ADZE Hub for others to see your recommendations.
        </div>
    );
}


