const Q = require('q');
const config = require('../../../src/config');
const emailService = require('../../../src/lib/emailService.js');
const adminService = require('../../../src/services/adminService.js');
const messagingService = require('../../../src/services/messagingService');

describe('messagingService', () => {
  let emailServiceMock;
  let adminServiceStub;

  beforeEach(() => {
    emailServiceMock = sinon.mock(emailService);
    adminServiceStub = sinon.stub(adminService, 'admins');
  });

  afterEach(() => {
    emailServiceMock.restore();
    adminServiceStub.restore();
  });

  describe('sendWelcomeEmail', () => {
    it('does not send an email if sendEmails is not true', () => {
      const member = { email: 'change-agent@test.com' };
      config.email.sendEmails = 'false';

      emailServiceMock.expects('sendHtmlEmail').never();
      return messagingService.sendWelcomeEmail(member).should.eventually.equal(member);
    });

    it('sends the templated welcome email with member info to the email service', () => {
      const member = { email: 'change-agent@test.com' };
      adminServiceStub.returns(Promise.resolve([{ email: 'admin1@email.com' }, { email: 'admin2@email.com' }]));
      config.email.sendEmails = 'true';
      config.email.welcomeSubject = 'welcome from the rabble schnauzer';
      config.email.welcomeBody = 'It\'s lovely to have you on board';
      config.email.replyTo = 'replyto@admin.com';

      const templatedMail = {
        from: 'replyto@admin.com',
        to: 'change-agent@test.com',
        bcc: ['admin1@email.com', 'admin2@email.com'],
        subject: 'welcome from the rabble schnauzer',
        body: 'It\'s lovely to have you on board',
        replyTo: 'replyto@admin.com',
      };

      emailServiceMock.expects('sendHtmlEmail').once().withArgs(templatedMail).returns(Q.when('sent'));
      return messagingService.sendWelcomeEmail(member).should.eventually.be.fulfilled;
    });

    it('throws an error when the email service call is not successfull', () => {
      const member = { email: 'change-agent@test.com' };
      adminServiceStub.returns(Promise.resolve([{ email: 'admin1@email.com' }, { email: 'admin2@email.com' }]));
      config.email.sendEmails = 'true';

      emailServiceMock.expects('sendHtmlEmail').once().throws('some error');
      return messagingService.sendWelcomeEmail(member).should.be.rejectedWith('some error');
    });
  });
});
