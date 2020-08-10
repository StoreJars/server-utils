import sgMail from '@sendgrid/mail';

export default class Mailer {
  private key: string;
  private sender: string;

  constructor(key, sender) {
    this.key = key;
    this.sender = sender;

    sgMail.setApiKey(this.key);
  }

  public async sendMail(to: string, subject: string, message: string) {
    const msg = {
      to,
      from: this.sender,
      subject,
      text: message,
      html: message,
    };

    return sgMail.send(msg);
  }
}
