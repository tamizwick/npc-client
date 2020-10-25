import React, { useEffect, useState, useCallback } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import classes from './Page.module.css';

import SignIn from '../Auth/SignIn/SignIn';
import SignUp from '../Auth/SignUp/SignUp';
import Characters from '../Characters/Characters';
import NewCharacter from '../Characters/NewCharacter/NewCharacter';

import { SignInData } from '../../interfaces';
import { SignUpData } from '../../interfaces';

const Page: React.FC = () => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(true);

    const signInHandler = (event: React.FormEvent<HTMLFormElement>, signInData: SignInData) => {
        event.preventDefault();
        signIn(signInData);
    };

    const signIn = (signInData: SignInData) => {
        fetch('http://localhost:8080/auth/signin', {
            method: 'POST',
            body: JSON.stringify({
                email: signInData.email,
                password: signInData.password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                setToken(response.token);
                localStorage.setItem('npcToken', response.token);
                const milliseconds = 1000 * 60 * 60 * 24;
                const expDate = new Date(new Date().getTime() + milliseconds);
                localStorage.setItem('npcExpDate', expDate.toISOString());
                setAutoSignOut(milliseconds);
            })
            .catch((err) => console.log(err));
    };

    const signUpHandler = (event: React.FormEvent<HTMLFormElement>, signUpData: SignUpData) => {
        event.preventDefault();
        fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: signUpData.username,
                email: signUpData.email,
                password: signUpData.password
            })
        })
            .then((res) => {
                return res.json();
            })
            .then((response) => {
                if (response.message === 'User created.') {
                    signIn({
                        email: signUpData.email,
                        password: signUpData.password
                    });
                }
            })
            .catch((err) => console.log(err));
    };

    const signOut = () => {
        setToken('');
        localStorage.removeItem('npcToken');
        localStorage.removeItem('npcExpDate');
    };

    const setAutoSignOut = useCallback((milliseconds: number) => {
        setTimeout(signOut, milliseconds);
    }, []);

    useEffect(() => {
        const expDate = localStorage.npcExpDate;
        const token = localStorage.npcToken;
        if (expDate && new Date(expDate) <= new Date()) {
            signOut();
            const milliseconds = new Date(expDate).getTime() - new Date().getTime();
            setAutoSignOut(milliseconds);
        }
        if (token) {
            setToken(token);
        }
        setLoading(false);
    }, [setToken, setLoading, setAutoSignOut]);

    let routes = <CircularProgress color="secondary" />
    if (!loading && !token.length) {
        routes = (
            <Switch>
                <Route path="/signin" render={(props) => <SignIn submit={signInHandler} />} />
                <Route path="/signup" render={(props) => <SignUp submit={signUpHandler} />} />
                <Redirect to="/signin" />
            </Switch >
        );
    } else if (!loading && token.length) {
        routes = (
            <Switch>
                <Route path="/characters/new" render={(props) => <NewCharacter token={token} />} />
                <Route path="/characters" render={(props) => <Characters token={token} />} />
                <Redirect exact from="/" to="/characters" />
                <Redirect exact from="/signin" to="/characters" />
                <Redirect exact from="/signup" to="/characters" />
                <Redirect to="/404" />
            </Switch>
        );
    }

    return (
        <main className={classes.main}>
            <Router>
                {routes}
            </Router>
        </main>
    );
};

export default Page;