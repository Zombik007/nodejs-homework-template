const Mailgen = require('mailgen')

class EmailService {
  constructor(env, sender) {
    this.sender = sender

    switch (env) {
      case 'development':
        this.link = 'http://3ad4-46-211-153-90.ngrok.io'
        break
      case 'production':
        this.link = 'link for production'
        break
      default:
        this.link = 'http://127.0.0.1:3000'
        break
    }
  }

  createTemplateEmail(name, verifyToken) {
    const mailGenerator = new Mailgen({
      theme: 'default',
      product: {
        name: 'Mailgen',
        link: this.link,
      },
    })

    const email = {
      body: {
        name,
        intro:
          'Welcome to Wild Users! We are very excited to have you on board.',
        action: {
          instructions: 'To get started with Wild Users, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verifyToken}`,
          },
        },
      },
    }
    return mailGenerator.generate(email)
  }

  async sendVerifyEmail(email, name, verifyToken) {
    const emailHTML = this.createTemplateEmail(name, verifyToken)
    const message = {
      to: email,
      subject: 'Verify your email',
      html: emailHTML,
    }
    try {
      const result = await this.sender.send(message)
      console.log(result)
      return true
    } catch (error) {
      console.log(error.message)
      return false
    }
  }
}

module.exports = EmailService
