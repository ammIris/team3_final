import React from 'react'
import Card from '../layout/card'
import Link from "next/link";


export default function Articles() {
  return (
    <>
    <div className="container">
    <div className="row row-cols-1 row-cols-md-3 container mx-auto my-3">
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Card></Card>
          <Link href={"/"} className="middle grey fs18b mx-auto my-3">
          看更多
        </Link>
        </div>
    </div>
    </>
  )
}