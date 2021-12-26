import React from 'react';
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/splide/dist/css/splide.min.css";

const ImgSlider = ({imgs}) => {
  return (
    <Splide
      options={{
        perPage: 1
        // the height is handeled in "post.css"
        , height: "var(--splide-height)"
        , cover: true
        , arrows: imgs.length > 1 ? true : false
      }}
    >
      {
        imgs.map((img) => {
          return (
            <SplideSlide key={ img.id } >
              <img src={ img.url } alt={ img.name }/>
            </SplideSlide>
          );
        })
      }
    </Splide>
  )
}

export default ImgSlider;