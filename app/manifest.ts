import { type MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "竹节记",
    short_name: "竹节记",
    description: "记录生活的点滴",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/bamboo-logo-64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/bamboo-logo-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/bamboo-logo-640.png",
        sizes: "640x640",
        type: "image/png"
      }
    ]
  }
} 