import { startAtLogin,
  title,
  enterEmail,
  enterPassword,
  clickLogin,
  clickLogout,
} from './pages/adminPage';

describe('Login page', function () {
  it('greets with Rabble Rouser Dashboard Login', function () {
    startAtLogin();
    title().should('include', 'Rabble Rouser - Login');
  });
});
