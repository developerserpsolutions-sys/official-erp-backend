import { createTransport } from "nodemailer";

const mailSender = async (email, title, body) => {
    try{
            let transporter = createTransport({
                host:process.env.EMAIL_HOST,
                auth:{
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                }
            })


            let info = await transporter.sendMail({
                from: 'Vision ERP || Shree ji ERP Solution',
                to:`${email}`,
                subject: `${title}`,
                html: `${body}`,
            })
            console.log(info);
            return info;
    }
    catch(error) {
        console.log(error.message);
    }
}


export default mailSender;