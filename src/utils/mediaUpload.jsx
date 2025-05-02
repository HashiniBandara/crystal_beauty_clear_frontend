import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://idaerdhzipvnpcwbzfft.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkYWVyZGh6aXB2bnBjd2J6ZmZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYyMDI4MjcsImV4cCI6MjA2MTc3ODgyN30.APMMkdLB6Y_xhuWKRswJ7h0s31O9mLrNoRmqwDfZXeY"
);

export default function mediaUpload(file) {

    const promise = new Promise(
        (resolve,reject)=>{
            if(file==null){
                reject("No file selected");
            }

            const timeStamp = new Date().getTime();
            const newFileName = timeStamp+file.name;

            supabase.storage.from("images").upload(newFileName,file,{
                cacheControl: '3600',
                upsert: false,
            }).then(
                ()=>{
                    const url=supabase.storage.from("images").getPublicUrl(newFileName).data.publicUrl;
                    resolve(url);
                }
            ).catch(
                (error)=>{
                    console.log(error);
                    reject("File upload failed");
                }
            )
        }
    )
    return promise
}

