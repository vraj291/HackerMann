import React,{useState} from 'react'
import {useParams} from 'react-router-dom'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField'
import { Typography } from '@material-ui/core';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {Redirect} from 'react-router-dom'
import { updatePassword } from '../../api/auth/api_auth';

export const PasswordReset = () => {

    const {token,user} = useParams()

    const [loginvalues, setLoginValues] = useState({
        password: '',
        con_pass : '',
        pass_error : false,
        con_pass_error : false,
        pass_errortext : '',
        con_pass_errortext : '',
        showPassword: false,
        showConPassword: false,
    })

    const [isloading,setLoading] = useState(false)
    const [success,setSuccess] = useState('')
    const [isAuth,setAuth] = useState(false)

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

    const resetLoginValues = () => {
        setLoginValues({
            password: '',
            con_pass : '',
            pass_error : false,
            con_pass_error : false,
            pass_errortext : '',
            con_pass_errortext : '',
            showPassword: false,
            showConPassword: false,
        })
        setSuccess('')
    }

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

    const update = () => {
        toggleLoader()
        if((loginvalues.password.length === 0) || (loginvalues.password != loginvalues.con_pass)){
            toggleLoader()
            resetLoginValues()
            if(loginvalues.password.length === 0){
                setLoginValues(prev => ({
                    ...prev,
                    password : '',
                    pass_error : true,
                    pass_errortext : 'Password is required',
                    con_pass : '',
                    con_pass_error : true,
                    con_pass_errortext : 'Passwords do not match'
                }))
            }else{
                setLoginValues(prev => ({
                    ...prev,
                    password : '',
                    pass_error : true,
                    pass_errortext : 'Passwords do not match',
                    con_pass : '',
                    con_pass_error : true,
                    con_pass_errortext : 'Passwords do not match'
                }))
            }
        }else{
            updatePassword({
                user : user,
                token : token,
                password : loginvalues.password
            }).then(({err,msg}) => {
                toggleLoader()
                if(!err){
                    setSuccess(msg)
                    setTimeout(setAuth(true),5000)
                }else{
                    resetLoginValues()
                    setSuccess(msg)
                }
            })
        }
    }

    if(isAuth){
        return <Redirect to='/'/>
    }

    return(
        <>
        <div class='loader-wrapper'>
            <div class="lds-ripple">
                <div></div>
                <div></div>
            </div>
            <div class='loading-title'>
                Updating Your Credentials
            </div>
        </div>
        <div className ='login-wrapper'>
            <Typography variant='h3' className={classes.root}>
                Hi {user.toUpperCase()}
            </Typography>
                <div className ='login'>
                    <Typography variant='h4' className={classes.root}>
                        Change Password
                    </Typography>
                    <InputLabel
                        className = {classes.label}
                        color = 'secondary'
                    >{success}</InputLabel>
                    <FormControl className={clsx(classes.root,classes.margin, classes.textField)}>
                    <TextField
                        id="standard-adornment-password"
                        label="New Password" 
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
                        label=" Confirm New Password" 
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
                        onClick={update}
                    >
                        <Typography className={classes.root}>Update</Typography>
                    </Button>
                </div>
            </div>
        </>
    )
}