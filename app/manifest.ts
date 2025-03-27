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
    orientation: "portrait",
    display_override: ["window-controls-overlay"],
    edge_side_panel: {
      preferred_width: 480
    },
    icons: [
      {
        src: "/images/bamnal-64x64.png",
        sizes: "64x64",
        type: "image/png"
      },
      {
        src: "/images/bamnal-192x192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/images/bamnal-640x640.png",
        sizes: "640x640",
        type: "image/png"
      }
    ]
  }
} 