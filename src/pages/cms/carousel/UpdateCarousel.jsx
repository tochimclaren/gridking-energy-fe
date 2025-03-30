import React from 'react'
import { useLocation } from 'react-router-dom';
import CarouselForm from '../../../components/cms/carousel/CarouselForm'


function UpdateCarousel() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const endpoint = `${BASE_URL}/carousel`
  const location = useLocation();
  const carouselData = location.state?.carousel;
  return (
    <CarouselForm initialData={carouselData} endpoint={endpoint} />
  )
}

export default UpdateCarousel