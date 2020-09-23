


const createIssue = async (context, comment)=>{
  setTimeout( async()=>{
    const issue = await context.github.issues.create({
      owner: context.payload.issue.user.login,
      repo: context.payload.repository.name,
      title: "Edubot: " + context.payload.comment.body.match(/\/raisehand\s(.*)\r*/)[1],
      labels: ["question", "edubot"],
      body: `
<!-- edubot-memory {"initiator": "${context.payload.sender.login}"} -->

Hi again @${context.payload.sender.login},

I looked around and found a few docs that might help.

### Docker setup docs

- [Getting Started with Docker](https://docs.docker.com/get-started/)
- [Getting started with Docker compose](https://docs.docker.com/compose/gettingstarted/)

### Related answered questions

- [Halp! Docker! Confusing!](https://github.com/renz45/asterbrands_hub/issues/18)
- [How do I run Rails in Docker?](https://github.com/renz45/asterbrands_hub/issues/16)
- [Having trouble with docker setup](https://github.com/renz45/asterbrands_hub/issues/14)

### Examples

I was also able to find a few examples of dockerfiles to look at.

- https://github.com/kstaken/dockerfile-examples
- https://github.com/dockerfile

### Get help from a person

Did you know there are people who love to help? I can try to connect you to someone who knows something about your problem if that would be helpful!

- [ ] Find a helper who has experience with this topic. :rocket:


ref ${context.payload.issue.html_url}
    `})

    context.github.issues.updateComment(comment.data.url, {body: `
Hi @${context.payload.sender.login}! I'm Edubot, let me see how I can help. :smiley:

Ok! I've created the tracking issue: ${issue.data.html_url}, lets head over there and get this figured out!
    `})
  }, 3000)
}

// old image https://i.pinimg.com/originals/26/66/d4/2666d4878b82ecbd4aad13f48f3ae932.gif
module.exports = app => {
  app.log.info('Yay, the app was loaded!')

  app.on(['issue_comment.created', 'issue_comment.edited'], async context => {
    if(context.payload.comment.body.match(/\/raisehand.*docker.*/)){
      const issueComment = context.issue({ body:  `
Hi @${context.payload.sender.login}! I'm Edubot, let me see how I can help. :smiley:

I'm going to do a little research and create a tracking issue for this question! ![](https://user-images.githubusercontent.com/599521/93955992-110b7b00-fd1f-11ea-8742-8652be558708.gif)
    `})

      const comment = await context.github.issues.createComment(issueComment)

      createIssue(context, comment)
      return comment
    }

//     let phrase = "/raisehand"
//     if (context.payload.comment.body.startsWith(phrase)) {
//       let helpMessage = context.payload.comment.body.match(/\/raisehand\s(.*)$/)[1]
//       let issueNumber = context.payload.issue.number
//       let issueUrl = context.payload.issue.html_url
//       let body = `
// [#${issueNumber}](${issueUrl}) ${helpMessage}

// I'm going to look for someone who might know more about this topic!
// `

//       const issue = {
//         owner: context.payload.issue.user.login,
//         repo: context.payload.repository.name,
//         title: helpMessage,
//         body: body,
//         labels: [
//           "help wanted"
//         ]
//       }
//       return context.github.issues.create(issue)
//     }
  })

  // Adds a comment when the new issue is closed
  app.on('issues.closed', async context => {
    // in real life this would check that this has the "help_wanted" label
    // context.log.info(context.payload)
    // in real life maybe this would be the last person to comment?

    const issueJson = context.payload.issue.body.match(/<!--\sedubot-memory\s(\{.*\})\s-->/)

    let data = {initiator: ""}

    if(issueJson) {
      data = JSON.parse(issueJson[1])
    }

    const message = `
:wave: One last thing @${(data.initiator)}!

Did @AwesomeHelper answer your question? If so, consider:

- giving them :sparkles: sparkles :sparkles: by responding with \`/kudos @AwesomeHelper\`
- [buying them a cup of coffee](github.com/sponsors/AwesomeHelper) :coffee:
`

    const issueComment = context.issue(
      { body: message }
    )
    return context.github.issues.createComment(issueComment)
  })

  // Handles when the reply issue is edited to select one of the options (sparkle or ask for help)
  app.on('issue_comment.edited', async context => {
    if (context.payload.comment.body.startsWith("Hello! Would you like to")) {
      if (context.payload.comment.body.includes("[x] Raise your hand")) {
        context.log.info(context.payload.comment.body)
      }
    }

  })

}
