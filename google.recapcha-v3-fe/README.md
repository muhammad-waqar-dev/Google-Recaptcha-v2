#Please follow these steps to use this simple google recaptcha v2

1-use your email to login in google or firefox

2-open https://www.google.com/recaptcha/about/ link

3-you see a v3 admin console on top and click on this

4-you see a form fill this form
_-label is my_google_captcha
_-select v2 option and checkbox
_-domain name is what and where you app is ruuning so i type localhost if you prefer you type your domain name e.g abc.com
_-type your email
\*-select agree policy and save

5-now save your site key and secret key e.g site key is use for frontend and secret key is use for backend for google captcha verification

6-install http-server globally on your system

7-add environmental variable in your host file
e.g 127.0.0.1 localhost
