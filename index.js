/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log.info('Yay, the app was loaded!')

  // Creates a new issue when someone comments on issue with raised hand
  app.on('issue_comment.created', async context => {
    let phrase = "/raisehand"
    if (context.payload.comment.body.startsWith(phrase)) {
      let helpMessage = context.payload.comment.body.match(/\/raisehand\s(.*)$/)[1]
      let issueNumber = context.payload.issue.number
      let issueUrl = context.payload.issue.html_url
      let body = `[#${issueNumber}](${issueUrl}) ${helpMessage}`

      const issue = {
        owner: context.payload.issue.user.login,
        repo: context.payload.repository.name,
        title: helpMessage,
        body: body,
        labels: [
          "help wanted"
        ]
      }
      context.github.issues.create(issue)
    }
  })

  // Handles when the reply issue is edited to select one of the options (sparkle or ask for help)
  app.on('issue_comment.edited', async context => {
    if (context.payload.comment.body.startsWith("Hello! Would you like to")) {
      if (context.payload.comment.body.includes("[x] Raise your hand")) {
        context.log.info(context.payload.comment.body)
      }
    }

  })

  // For more information on building apps:
  // https://probot.github.io/docs/

  // To get your app running against GitHub, see:
  // https://probot.github.io/docs/development/
}
