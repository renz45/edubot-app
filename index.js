/**
 * This is the main entrypoint to your Probot app
 * @param {import('probot').Application} app
 */
module.exports = app => {
  // Your code here
  app.log.info('Yay, the app was loaded!')

  // Sends a reply comment to someone who creates comment with raised hand
  app.on('issue_comment.created', async context => {
    if (context.payload.comment.body == "✋") {
      context.log.info(context.payload.comment.body)

      let message = 'Hello! Would you like to\n' +
      '- [ ] Raise your hand to ask for help _or_\n' +
      '- [ ] Give sparkles for answering a question'

      const issueComment = context.issue(
        { body: message }
      )
      return context.github.issues.createComment(issueComment)
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
