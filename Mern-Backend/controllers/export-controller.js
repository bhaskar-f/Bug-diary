import Bug from "../models/bug.js";

export const exportBugsAshtml = async (req, res) => {
  try {
    const bugs = await Bug.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.setHeader("Content-Type", "text/html");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=bug-diary-export.html",
    );

    // 2. Create the HTML structure as a string
    let htmlContent = `
  <html>
    <head><title>Bug Diary Export</title></head>
    <body>
      <h1>My Bug Diary</h1>
      <table border="1">
        <tr><th>Title</th><th>Status</th><th>Description</th></tr>
        ${bugs
          .map(
            (bug) => `
          <tr>
            <td>${bug.title}</td>
            <td>${bug.status}</td>
            <td>${bug.description}</td>
          </tr>
        `,
          )
          .join("")}
      </table>
    </body>
  </html>
`;

    // 3. Send the HTML string
    return res.send(htmlContent);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
