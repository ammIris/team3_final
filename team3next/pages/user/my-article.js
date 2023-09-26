import React from "react";
import MyNavbar from "../../components/layout/default-layout/navbar-main";
import UserNavbar from "@/components/user/user-navbar";
import Head from "next/head";
import UserInfo from "@/components/user/user-info";
import Footer from "@/components/layout/default-layout/footer";
import UserPictureCard from "@/components/user/user-picturecard";

export default function UserMyfrom() {
  return (
    <>
      <MyNavbar />
      <UserInfo></UserInfo>
      <UserNavbar></UserNavbar>
      <UserPictureCard></UserPictureCard>
      <Footer></Footer>
      <Head>
        <title>我的文章</title>
      </Head>
    </>
  );
}
