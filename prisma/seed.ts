const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const userData = [
  {
    name: "light",
    bgColor: "#ffffff",
    bgColor2: "#f0f0f0",
    clockShadow: "#cccccc",
    clockBezelColor: "#e0e0e0",
    clockBezelBorder: "#000000",
    clockFaceColor: "#f8f8f8",
    clockFaceShadow: "#000000",
    clockFaceBorder: "#000000",
    secColor: "#000000",
    secShadow: "#000000",
    minColor: "#000000",
    minBorder: "#f8f8f8",
    minShadow: "#000000",
    hrColor: "#000000",
    hrBorder: "#f8f8f8",
    hrShadow: "#000000",
    textColor: "#ffffff",
    textShadow: "#000000"
  },

  {
    name: "blue",
    bgColor: "#000000",
    bgColor2: "#000055",
    clockShadow: "#0000ff",
    clockBezelColor: "#000000",
    clockBezelBorder: "#0000ff",
    clockFaceColor: "#222222",
    clockFaceShadow: "#0000ff",
    clockFaceBorder: "#0000ff",
    secColor: "#0000ff",
    secShadow: "#0000ff",
    minColor: "#0000ff",
    minBorder: "#000000",
    minShadow: "#0000ff",
    hrColor: "#0000ff",
    hrBorder: "#000000",
    hrShadow: "#0000ff",
    textColor: "#4a34ea",
    textShadow: "#4a34ea"
  },
  {
    name: "green",
    bgColor: "#000000",
    bgColor2: "#0a460a",
    clockShadow: "#00ff00",
    clockBezelColor: "#000000",
    clockBezelBorder: "#00ff00",
    clockFaceColor: "#222222",
    clockFaceShadow: "#00ff00",
    clockFaceBorder: "#00ff00",
    secColor: "#00ff00",
    secShadow: "#00ff00",
    minColor: "#009933",
    minBorder: "#000000",
    minShadow: "#009933",
    hrColor: "#00cc33",
    hrBorder: "#000000",
    hrShadow: "#00cc33",
    textColor: "#0a0e",
    textShadow: "#0a0"
  }
]

async function main() {
  console.log(`Start seeding ...`)
  for (const u of userData) {
    const user = await prisma.theme.create({
      data: u,
    })
    console.log(`Created user with id: ${user.id}`)
  }
  console.log(`Seeding finished.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
