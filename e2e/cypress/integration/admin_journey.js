import { startAtLogin,
  title,
  enterEmail,
  enterPassword,
  clickLogin,
} from './pages/adminPage';

describe('Admin', function () {
  it('should not be able to login with the wrong credentials', function () {
    startAtLogin();
    title().should('include', 'Rabble Rouser - Login')
    login('orgnsr@thebranch.org', 'bad password');
    title().should('include', 'Rabble Rouser - Login')
  });
});

function login(email, password) {
  return enterEmail(email)
    .then(() => enterPassword(password))
    .then(clickLogin);
}
