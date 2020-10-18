import React, { useState } from 'react';
import { TextField, Button } from '@material-ui/core';

import { SignUpData } from '../../../interfaces';

interface Props {
    submit: (e: React.FormEvent<HTMLFormElement>, signUpData: SignUpData) => void;
}

const SignUp: React.FC<Props> = (props) => {
    const [signUpData, setSignUpData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const inputHandler = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value
        });
    };

    return (
        <form autoComplete="off" onSubmit={(e) => props.submit(e, signUpData)}>
            <TextField
                label="Username"
                required
                id="username"
                name="username"
                onChange={(e) => inputHandler(e)} />
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
            <TextField
                label="Confirm password"
                required
                type="password"
                id="confirmPassword"
                name="confirmPassword"
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

export default SignUp;