import { GetStaticProps } from 'next'
import Image from 'next/future/image'
import Stripe from 'stripe'
import { stripe } from '../../lib/stripe'
import {
  ImageContainer,
  ProductContainer,
  ProductDetails,
} from '../../styles/pages/product'

interface ProductProps {
  product: {
    id: string
    name: string
    imageUrl: string
    price: string
    description: string
  }
}

export default function Product({ product }: ProductProps) {
  return (
    <ProductContainer>
      <ImageContainer>
        <Image src={product.imageUrl} width={520} height={480} alt="" />
      </ImageContainer>

      <ProductDetails>
        <h1>{product.name}</h1>
        <span>{product.price}</span>

        <p>{product.description}</p>

        <button>Comprar agora</button>
      </ProductDetails>
    </ProductContainer>
  )
}

export const getStaticProps: GetStaticProps<any, { id: string }> = async ({
  params,
}) => {
  if (!params?.id) {
    return {
      notFound: true,
    }
  }

  const productId = params.id

  const product = await stripe.products.retrieve(productId, {
    expand: ['default_price'],
  })

  const price = product.default_price as Stripe.Price

  const priceUnitAmount = price?.unit_amount ? price.unit_amount / 100 : 0
  const priceFormatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(priceUnitAmount)

  return {
    props: {
      product: {
        id: product.id,
        name: product.name,
        imageUrl: product.images[0],
        price: priceFormatted,
        description: product.description,
      },
    },
    revalidate: 60 * 60 * 1, // 1 hours
  }
}
