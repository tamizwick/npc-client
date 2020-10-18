import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

import { SignInData } from '../../../interfaces';

interface Props {
    submit: (e: React.FormEvent<HTMLFormElement>, signInData: SignInData) => void;
}

const SignIn: React.FC<Props> = (props) => {
    const [signInData, setSignInData] = useState({
        email: '',
        password: ''
    });

    const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSignInData({
            ...signInData,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form autoComplete="off" onSubmit={(e) => props.submit(e, signInData)}>
            <TextField
                label="Email"
                required
                id="email"
                name="email"
                onChange={(e) => inputHandler(e)} />
            <TextField
                label="Password"
                required
                type="password"
                id="password"
                name="password"
                onChange={(e) => inputHandler(e)} />
            <Button
                variant="contained"
                color="primary"
                type="submit">
                Submit
            </Button>
        </form>
    );
};

export default SignIn;