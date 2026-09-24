import 'dotenv/config'
import { prisma } from '../lib/prisma'
import products from '../data/products.json'
import themesData from '../data/themes.json'
import blogs from '../data/blog.json'

async function main() {
  console.log('Seeding Database...')

  // Clear existing data
  await prisma.product.deleteMany({})
  await prisma.theme.deleteMany({})
  await prisma.blogPost.deleteMany({})
  await prisma.orderRequest.deleteMany({})

  // Seed Products
  for (const product of products) {
    await prisma.product.create({
      data: {
        slug: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        priceRange: product.priceRange,
        description: product.description,
        shortDesc: product.shortDesc,
        images: product.images,
        tags: product.tags,
        customizable: product.customizable,
        variants: product.variants ? JSON.parse(JSON.stringify(product.variants)) : null,
        featured: product.featured,
        isNew: product.isNew,
        stock: product.stock,
      },
    })
  }
  console.log(`Seeded ${products.length} products.`)

  // Seed Themes
  for (const theme of themesData.themes) {
    await prisma.theme.create({
      data: {
        slug: theme.id,
        name: theme.name,
        emoji: theme.emoji,
        colors: JSON.parse(JSON.stringify(theme.colors)),
      },
    })
  }
  console.log(`Seeded ${themesData.themes.length} themes.`)

  // Seed Blogs
  for (const blog of blogs) {
    await prisma.blogPost.create({
      data: {
        slug: blog.slug,
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        date: blog.date,
        readTime: blog.readTime,
        author: blog.author,
        category: blog.category,
        image: blog.image,
        featured: blog.featured,
      },
    })
  }
  console.log(`Seeded ${blogs.length} blog posts.`)

  console.log('Database Seeding Completed Successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
