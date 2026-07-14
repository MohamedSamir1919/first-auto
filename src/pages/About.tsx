import React from 'react'
import Footer from '../components/Footer'
type Props = {}

const About = (props: Props) => {
    return (
        <div className="flex flex-col justify-center mt-[100px] items-center">
            <h1 className="outline">First Auto</h1>
            {/* <img src='/mosasha/SaSha.png' className="w-[200px] h-[200px] rounded-[50%]" /> */}

            <div className="flex">
                <p className="float-left">
                    <img className="float-right h-[200px] sm:flex hidden" src={`/mosasha/question.png`} />

                    You can see us as your trusted partner in the trading of car spare parts,
                    dedicated to providing you with high-quality products and exceptional service.
                    Our team is passionate about cars and committed to helping you find the right parts for your vehicle.
                    <br />
                    We hope to sign up for get discounts and offers and get the best experience with us.

                </p>
            </div>
            {/* <div className="w-full flex justify-center items-center">
                <div className="w-full grid  grid-flow-row md:p-4 grid-cols-2 sm:grid-cols-3">
                    <div className="col-span-1 flex flex-col m-auto">
                        <div className="
                    rounded-[50%] overflow-hidden w-[150px] h-[150px] flex justify-center items-center bg-gray-200
                    ">
                            <img className="w-[100px] " src="/mosasha/none.png" />
                        </div>
                        <div className="w-[150px]">
                            <h3 className="text-gray-300">Mohamed Samir </h3>
                            <p className="">
                                Website developer, Some owner in some way, I am happy to be here
                            </p>
                        </div>
                    </div>


                    <div className="col-span-1 flex flex-col m-auto">
                        <div className="
                    rounded-[50%] overflow-hidden w-[150px] h-[150px] flex justify-center items-center bg-gray-200
                    ">
                            <img className="w-[100px] " src="/mosasha/none.png" />
                        </div>
                        <div className="w-[150px]">
                            <h3 className="text-gray-300">also me</h3>
                            <p className="">
                                nothing more
                            </p>
                        </div>
                    </div>

                    <div className="col-span-1 flex flex-col m-auto">
                        <div className="
                    rounded-[50%] overflow-hidden w-[150px] h-[150px] flex justify-center items-center bg-gray-200
                    ">
                            <img className="w-[100px] " src="/mosasha/none.png" />
                        </div>
                        <div className="w-[150px]">
                            <h3 className="text-gray-300">it's me</h3>
                            <p className="">
                                what you think !
                            </p>
                        </div>
                    </div>


                </div>
            </div> */}
            <Footer />
        </div>
    )
}

export default About