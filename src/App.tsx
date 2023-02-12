import { createBrowserRouter, Link, redirect, RouterProvider } from 'react-router-dom';
import CreateAccount from './CreateAccount';
import { auth } from './firebase';
import SignIn from './SignIn';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <p>
        Hello, please <Link to='/sign-in'>sign in</Link> or{' '}
        <Link to='/create-account'>create an account</Link>.
      </p>
    ),
  },
  {
    path: '/protected',
    element: (
      <p>
        You’re signed in!{' '}
        <button
          onClick={() => {
            auth.signOut().then(() => {
              router.navigate('/');
            });
          }}
        >
          Sign Out
        </button>
      </p>
    ),
    loader: () => {
      return auth.currentUser ?? redirect('/sign-in');
    },
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/create-account',
    element: <CreateAccount />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
