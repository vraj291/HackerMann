import React,{useState,useEffect} from 'react'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import google from '../../assets/google_logo.jpg'
import github from '../../assets/github_logo.png'
import './Login.css'
import {Redirect} from 'react-router-dom'
import { registerUser,loginUser,changePassword } from '../../api/auth/api_auth';
import { setJWT } from '../../api/auth/auth_helpers';


export const Login = () => {
    
    const [loginvalues, setLoginValues] = useState({
        email : 'test@test.com',
        user : 'vraj',
        password: 'hello123',
        con_pass : 'hello123',
        user_error : false,
        pass_error : false,
        con_pass_error : false,
        email_errortext : '',
        user_errortext : '',
        pass_errortext : '',
        con_pass_errortext : '',
        email_error : false,
        showPassword: false,
        showConPassword: false,
    })

    const [login_mode,setLoginMode] = useState(true)
    const [isloading,setLoading] = useState(false)
    const [isAuth,setAuth] = useState(false)
    const [success,setSuccess] = useState('')

    const useStyles = makeStyles((theme) => ({
        root: {
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bold'
        },
        margin: {
            margin: theme.spacing(1),
        },
        withoutLabel: {
            marginTop: theme.spacing(3),
        },
        textField: {
            width: '31ch',
        },
        label:{
            fontFamily : "'Titillium Web', sans-serif",
            fontWeight : 'bolder',
            cursor : 'pointer'
        },
        next_butt:{
            position : 'absolute',
            top: '4.7%',
            right: '5%'
        },
        prev_butt:{
            position : 'absolute',
            top: '5%',
            left: '5%'
        }
    })
    )

    const classes = useStyles();

    const handleChange = (prop) => (event) => {
        setLoginValues(prev => ({ ...prev, [prop]: event.target.value }));
    }

    const handleClickShowPassword = (type) => {
        if(type === 0){
            setLoginValues(prev => ({ ...prev, showPassword: !prev.showPassword }));
        }else{
            setLoginValues(prev => ({ ...prev, showConPassword: !prev.showConPassword }));
        }
    };
    
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const toggleLoader = () =>{
        let ele = document.getElementsByClassName('loader-wrapper')[0]
        setLoading(prev => {
            if(prev){
                ele.style.visibility = 'hidden'
            }else{
                ele.style.visibility = 'visible'
            }
            return !prev
        })
    }

    const resetLoginValues = () => {
        setLoginValues({
            email : '',
            user : '',
            password: '',
            con_pass : '',
            user_error : false,
            pass_error : false,
            con_pass_error : false,
            email_error : false,
            email_errortext : '',
            user_errortext : '',
            pass_errortext : '',
            con_pass_errortext : '',
            showPassword: false,
            showConPassword: false,
        })
        setSuccess('')
    }

    const toggleMode = () => {
        setLoginMode(prev => !prev)
        resetLoginValues()
    }

    const register = () => {
        toggleLoader()
        if(loginvalues.password != loginvalues.con_pass){
            toggleLoader()
            setLoginValues(prev => ({
                ...prev,
                password : '',
                pass_error : true,
                pass_errortext : 'Passwords do not match',
                con_pass : '',
                con_pass_error : true,
                con_pass_errortext : 'Passwords do not match'
            }))
        }else{
        registerUser({
            email : loginvalues.email,
            user : loginvalues.user,
            password : loginvalues.password
        }).then(({err,msg}) => {
            toggleLoader()
            if(!err){
                resetLoginValues()
                setSuccess(msg)
                setLoginMode(prev => !prev)
            }
            else{
                if(msg.startsWith('User')){
                    resetLoginValues()
                    setLoginValues(prev => ({
                        ...prev,
                        user_error : true,
                        user_errortext : msg
                    }))
                }else if(msg.startsWith('Email')){
                    resetLoginValues()
                    setLoginValues(prev => ({
                        ...prev,
                        email_error : true,
                        email_errortext : msg
                    }))
                }else if(msg.startsWith('Password')){
                    setLoginValues(prev => ({
                        ...prev,
                        password : '',
                        pass_error : true,
                        pass_errortext : msg,
                        con_pass : '',
                        con_pass_error : true,
                        con_pass_errortext : 'Passwords do not match'
                    }))
                }
            }
        })
        }
    }

    const login = () => {
        toggleLoader()
        setSuccess('')
        loginUser({
            user : loginvalues.user,
            password : loginvalues.password
        }).then(({err,msg}) => {
            toggleLoader()
            if(!err){
                setAuth(true)
            }else{
                if(msg.startsWith('User')){
                    resetLoginValues()
                    setLoginValues(prev => ({
                        ...prev,
                        user_error : true,
                        user_errortext : msg
                    }))
                }else if(msg.startsWith('Password')){
                    setLoginValues(prev => ({
                        ...prev,
                        pass_error : true,
                        pass_errortext : msg
                    }))
                }else{
                    setSuccess(msg)
                }
            }
        })
    }

    const forgotPass = () => {
        toggleLoader()
        setSuccess('')
        if(loginvalues.user === ''){
            toggleLoader()
            resetLoginValues()
            setLoginValues(prev => ({
                ...prev,
                user_error : true,
                user_errortext : 'Username is required.'
            }))
        }else{
            changePassword({
                user : loginvalues.user
            }).then(({err,msg}) => {
                toggleLoader()
                resetLoginValues()
                setSuccess(msg)
            })
        }
    }

    const googleSignin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URI}/googleSigninURL`
    }

    const githubSignin = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URI}/githubSigninURL`
    }

    useEffect(() => {
        let url = window.location.hash
        console.log(url)
        if (url.substring(url.indexOf('?')+1,url.indexOf('=')) === 'error'){
            setSuccess(decodeURIComponent(url.slice(url.indexOf('=')+1)))
        }else if (url.substring(url.indexOf('?')+1,url.indexOf('=')) === 'token'){
            setJWT(url.substring(url.indexOf('=')+1,url.indexOf('&')))
            setLoginValues(prev => ({
                ...prev,
                user: url.slice(url.lastIndexOf('=')+1)
            }))
            setAuth(true)
        }
    },[])

    if(isAuth){
        return <Redirect to={`/profile/${loginvalues.user}`}/>
    }

    return(
        <>
        <div class='loader-wrapper'>
            <div class="lds-ripple">
                <div></div>
                <div></div>
            </div>
            <div class='loading-title'>
                Checking Your Credentials
            </div>
        </div>
        <div className ='login-wrapper'>
            <Typography variant='h3' className={classes.root}>
                HACKERMANN
            </Typography>
            <Typography variant='h5' className={classes.root}>
                A collaborative coding platform
            </Typography>
            {login_mode? 
                <div className ='login'>
                <IconButton className={clsx(classes.next_butt,'next-button')} onClick={toggleMode}>
                    <ArrowForwardIcon fontSize='large'/>
                </IconButton>
                <Typography variant='h4' className={classes.root}>
                    Login
                </Typography>
                <InputLabel
                    className = {classes.label}
                    color = 'secondary'
                >{success}</InputLabel>
                <TextField 
                    className={clsx(classes.root,classes.margin, classes.textField)}
                    label=" User" 
                    variant="outlined"
                    error = {loginvalues.user_error}
                    helperText = {loginvalues.user_error? loginvalues.user_errortext : ''}
                    value={loginvalues.user}
                    onChange={handleChange('user')}
                />
                <FormControl className={clsx(classes.root,classes.margin, classes.textField)}>
                    <TextField
                        id="standard-adornment-password"
                        label="Password" 
                        variant="outlined"
                        type={loginvalues.showPassword ? 'text' : 'password'}
                        value={loginvalues.password}
                        onChange={handleChange('password')}
                        error = {loginvalues.pass_error}
                        helperText = {loginvalues.pass_error? loginvalues.pass_errortext : ''}
                        InputProps={{
                        endAdornment : 
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleClickShowPassword(0)}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {loginvalues.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                </FormControl>   
                <InputLabel
                    className = {classes.label}
                    color = 'secondary'
                    onClick = {forgotPass}
                >Forgot Password?
                </InputLabel> 
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={login}
                >
                    <Typography className={classes.root}>Login</Typography>
                </Button>
                <div className='login-seperator'/>
                <div className='google-login-wrapper' onClick={googleSignin}>
                    <img src={google} className='google-login-logo'/>
                    Login with Google
                </div>
                <div className='google-login-wrapper github-login-wrapper' onClick={githubSignin}>
                    <img src={github} className='github-login-logo'/>
                    Login with Github
                </div>
                </div> : 
                <div className ='login'>
                    <Typography variant='h4' className={classes.root}>
                        Register
                    </Typography>
                    <IconButton className={clsx(classes.prev_butt,'prev-button')} onClick={toggleMode}>
                        <ArrowBackIcon fontSize='large'/>
                    </IconButton>
                    <TextField 
                        className={clsx(classes.root,classes.margin, classes.textField)}
                        label="Email" 
                        variant="outlined"
                        error = {loginvalues.email_error}
                        helperText = {loginvalues.email_error? loginvalues.email_errortext : ''}
                        value={loginvalues.email}
                        onChange={handleChange('email')}
                    />
                    <TextField 
                        className={clsx(classes.root,classes.margin, classes.textField)}
                        label=" User" 
                        variant="outlined"
                        error = {loginvalues.user_error}
                        helperText = {loginvalues.user_error? loginvalues.user_errortext : ''}
                        value={loginvalues.user}
                        onChange={handleChange('user')}
                    />
                    <FormControl className={clsx(classes.root,classes.margin, classes.textField)}>
                    <TextField
                        id="standard-adornment-password"
                        label="Password" 
                        variant="outlined"
                        type={loginvalues.showPassword ? 'text' : 'password'}
                        value={loginvalues.password}
                        onChange={handleChange('password')}
                        error = {loginvalues.pass_error}
                        helperText = {loginvalues.pass_error? loginvalues.pass_errortext : ''}
                        InputProps={{
                        endAdornment : 
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleClickShowPassword(0)}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {loginvalues.showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    </FormControl> 
                    <FormControl>  
                    <TextField
                        id="standard-adornment-password"
                        label=" Confirm Password" 
                        variant="outlined"
                        type={loginvalues.showConPassword ? 'text' : 'password'}
                        value={loginvalues.con_pass}
                        onChange={handleChange('con_pass')}
                        error = {loginvalues.con_pass_error}
                        helperText = {loginvalues.con_pass_error? loginvalues.con_pass_errortext : ''}
                        InputProps={{
                        endAdornment : 
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => handleClickShowPassword(1)}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {loginvalues.showConPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }}
                    />
                    </FormControl>
                    <InputLabel
                        className = {classes.label}
                    ></InputLabel> 
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={register}
                    >
                        <Typography className={classes.root}>Register</Typography>
                    </Button>
                </div>
            }  
        </div>
    </>
    )
}