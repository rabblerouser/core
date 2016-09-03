import Q from 'q';
import config from 'config';
import emailService from '../../../src/lib/emailService.js';
import adminService from '../../../src/services/adminService.js';
import messagingService from '../../../src/services/messagingService';

describe('messagingService', () => {
  let configStub;
  let emailServiceMock;
  let adminServiceStub;

  beforeEach(() => {
    configStub = sinon.stub(config, 'get');
    emailServiceMock = sinon.mock(emailService);
    adminServiceStub = sinon.stub(adminService, 'admins');
  });

  afterEach(() => {
    config.get.restore();
    emailServiceMock.restore();
    adminServiceStub.restore();
  });

  describe('sendWelcomeEmail', () => {
    it('does not send an email if the sendEmails config toggle is missing', () => {
      const member = { email: 'change-agent@test.com' };
      configStub.withArgs('email.sendEmails').returns(undefined);

      emailServiceMock.expects('sendHtmlEmail').never();
      return messagingService.sendWelcomeEmail(member).should.eventually.equal(member);
    });

    it('sends the templated welcome email with member info to the email service', () => {
      const member = { email: 'change-agent@test.com' };
      adminServiceStub.returns(Promise.resolve([{ email: 'admin1@email.com' }, { email: 'admin2@email.com' }]));
      configStub.withArgs('email.sendEmails').returns('toggled-on');
      configStub.withArgs('email.welcome.subject').returns('welcome from the rabble schnauzer');
      configStub.withArgs('email.welcome.body').returns('It\'s lovely to have you on board');
      configStub.withArgs('email.membershipEmail').returns('replyto@admin.com');

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
      configStub.withArgs('email.sendEmails').returns('toggled-on');

      emailServiceMock.expects('sendHtmlEmail').once().throws('some error');
      return messagingService.sendWelcomeEmail(member).should.be.rejectedWith('some error');
    });
  });
});
