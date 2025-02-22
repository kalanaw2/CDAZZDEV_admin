"use client";

// ** React Imports
import { useState, useEffect } from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Components
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import useMediaQuery from "@mui/material/useMediaQuery";
import OutlinedInput from "@mui/material/OutlinedInput";
import { styled, useTheme } from "@mui/material/styles";
import FormHelperText from "@mui/material/FormHelperText";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import MuiFormControlLabel from "@mui/material/FormControlLabel";
import Grow from "@mui/material/Grow";
import Slide from "@mui/material/Slide";
import CircularProgress from "@mui/material/CircularProgress";

// ** Icon Imports
import { Icon } from "@iconify/react";

// ** Third Party Imports
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Swal from "sweetalert2";
import { useRouter } from "next/navigation";



const RightWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.up("md")]: {
    maxWidth: 400,
  },
  [theme.breakpoints.up("lg")]: {
    maxWidth: 400,
  },
  [theme.breakpoints.up("xl")]: {
    maxWidth: 450,
  },
}));

const BoxWrapper = styled(Box)(({ theme }) => ({
  width: "100%",
  [theme.breakpoints.down("md")]: {
    maxWidth: 400,
  },
}));


const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

const defaultValues = {
  password: "",
  email: "",
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  // ** Hooks

  const router = useRouter()

  const theme = useTheme();

  const hidden = useMediaQuery(theme.breakpoints.down("md"));

  const {
    control,
    setError,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues,
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const emailValue = watch("email");

  const onSubmit = async (data) => {
    setLoginLoading(true);
    const { email, password } = data;

    console.log(data);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/student/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: password,
          }),
        }
      );
      const data = await response.json();
      if (response.status == 200) {
        Swal.fire({
          title: `${data.message}`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          customClass: {
            container: "custom-swal-container", // Add a custom class to the container
          },
        });
        setLoginLoading(false);
        window.localStorage.setItem('userID', data.user_id)
        window.localStorage.setItem('token', data.accessToken)
        window.localStorage.setItem('refreshToken', data.refreshToken)
        router.push("/");
      } else {
      
        setError("password", { type: "manual", message: data.message }); 
        setLoginLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };



  return (
    <>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          overflowX: "hidden",
          position: "relative", // Ensures the background image stays within the box
        }}
      >
        {!hidden && (
          <Box sx={{ position: "relative", width: "100%", opacity: 1 }}>
            <Box sx={{ width: "100%", height: "100%" }}>
              <img
                src="/bgimage.jpg"
                alt="logo"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  zIndex: 1, // Ensures the image is behind other content
                }}
              />
            </Box>

            <Box
              sx={{
                position: "absolute",
                left: { xs: 20, lg: 10 },
                right: 0,
                bottom: 0,
                zIndex: 2, // Keeps the login icon on top of the background image
              }}
            >
              <Slide
                direction="right"
                in={true}
                mountOnEnter
                unmountOnExit
                timeout={{ enter: 1000, exit: 1000 }}
                easing={{
                  enter: "ease-out", // Slows down at the end
                  exit: "ease-in", // Starts slow and speeds up when exiting
                }}
              >
                <Box sx={{ width: { xs: "300px", lg: "400px", xl: "500px" } }}>
                  <img
                    src={"/slideimage.png"}
                    alt="welcome"
                    style={{
                      width: "100%",
                      height: "auto",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              </Slide>
            </Box>
          </Box>
        )}

        <RightWrapper sx={{ borderLeft: `1px solid ${theme.palette.divider}` }}>
          <Box
            sx={{
              p: 7,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(45deg, #101847, #00669e)",
              boxShadow: "0 25px 50px 2px ",
              broder: 1,
              borderColor: "red",
              position: "relative", // Ensure this content is positioned properly
              zIndex: 3, // Ensure this content appears above the background
            }}
          >
            <BoxWrapper>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  mb: 10,
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <img
                    src="/logo.png"
                    alt="logo"
                    style={{ width: "40%", height: "auto" }}
                  />
                </Box>
              </Box>
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        autoFocus
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        error={Boolean(errors.email)}
                        placeholder="Email"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                          style: { color: "black" },
                        }}
                        InputProps={{
                          style: {
                            color: "#4c4e64de",
                            "&::placeholder": {
                              color: "#4c4e64de",
                            },
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderColor: "white",
                            backgroundColor: "white",
                          },
                        }}
                      />
                    )}
                  />
                  {errors.email && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.email.message}
                    </FormHelperText>
                  )}
                </FormControl>
                <FormControl fullWidth>
                  <Controller
                    name="password"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <TextField
                        value={value}
                        onBlur={onBlur}
                        onChange={onChange}
                        id="auth-login-v2-password"
                        error={Boolean(errors.password)}
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        size="small"
                        InputLabelProps={{
                          shrink: true,
                          style: { color: "black" },
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                edge="end"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Icon
                                  icon={
                                    showPassword
                                      ? "mdi:eye-outline"
                                      : "mdi:eye-off-outline"
                                  }
                                  fontSize={20}
                                  style={{ color: "black" }}
                                />
                              </IconButton>
                            </InputAdornment>
                          ),
                          style: {
                            color: "#4c4e64de",
                            "&::placeholder": {
                              color: "#4c4e64de",
                            },
                          },
                        }}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderColor: "white",
                            backgroundColor: "white",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            border: "1px solid white",
                          },
                        }}
                      />
                    )}
                  />
                  {errors.password && (
                    <FormHelperText sx={{ color: "error.main" }}>
                      {errors.password.message}
                    </FormHelperText>
                  )}
                </FormControl>
                {/* <Box
                  sx={{
                    mb: 4,
                    mt: 2,
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    variant="body2"
                    component={Link}
                    href="/register"
                    sx={{ color: "white", textDecoration: "none" }}
                  >
                    New here? Sign up!
                  </Typography>
                </Box> */}
                <Button
                  endIcon={loginLoading ? <CircularProgress size={20} /> : null}
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  disabled={loginLoading}
                  sx={{
                    mt: 2,
                    mb: 7,
                    backgroundColor: loginLoading ? "gray" : "#5BB4E4",
                    ":hover": {
                      backgroundColor: loginLoading ? "gray" : "#5BB4E4",
                    },
                    "&.Mui-disabled": {
                      backgroundColor: "gray", // Custom disabled color (grayish-blue)
                      color: "#ffffff", // Change text color if needed
                    },
                  }}
                >
                  Login
                </Button>
              </form>
            </BoxWrapper>
          </Box>
        </RightWrapper>
      </Box>
    </>
  );
};

export default LoginPage;
