'use client'

import { useParams } from 'next/navigation'
import { PageLayout } from '@/components/page-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  Clock,
  User as UserIcon,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Eye,
  Heart,
  MessageCircle,
  BookmarkPlus,
  TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

// Types pour les props des composants
interface FadeInProps {
  children: React.ReactNode
  delay?: number
}

interface ShareButtonsProps {
  title: string
  url: string
}

// Composant pour les animations de fade in avec des effets plus avancés
const FadeIn = ({ children, delay = 0 }: FadeInProps) => (
  <motion.div
    initial={{ opacity: 0, y: 30, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      duration: 0.6,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
  >
    {children}
  </motion.div>
)

// Composant pour les animations de slide in
const SlideIn = ({
  children,
  direction = 'left',
  delay = 0
}: {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up'
  delay?: number
}) => (
  <motion.div
    initial={{
      opacity: 0,
      x: direction === 'left' ? -50 : direction === 'right' ? 50 : 0,
      y: direction === 'up' ? 50 : 0
    }}
    animate={{ opacity: 1, x: 0, y: 0 }}
    transition={{
      duration: 0.7,
      delay,
      ease: [0.25, 0.46, 0.45, 0.94]
    }}
  >
    {children}
  </motion.div>
)

// Composant pour le partage sur les réseaux sociaux avec animations
const ShareButtons = ({ title, url }: ShareButtonsProps) => {
  const shareText = `Découvrez cet article : ${title}`
  const currentUrl =
    typeof window !== 'undefined' ? window.location.origin + url : ''

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        currentUrl
      )}`,
      color: 'hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}&url=${encodeURIComponent(currentUrl)}`,
      color: 'hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950'
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        currentUrl
      )}&title=${encodeURIComponent(title)}`,
      color: 'hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950'
    }
  ]

  return (
    <motion.div
      className='flex flex-col sm:flex-row sm:items-center justify-between mt-12 pt-8 border-t border-border bg-gradient-to-r from-muted/30 to-background rounded-xl p-6'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className='flex items-center space-x-2 mb-4 sm:mb-0'>
        <Share2 className='w-5 h-5 text-muted-foreground' />
        <span className='text-sm font-medium text-muted-foreground'>
          Partager cet article
        </span>
      </div>
      <div className='flex space-x-3'>
        {socialLinks.map((social, index) => (
          <motion.a
            key={social.name}
            href={social.url}
            target='_blank'
            rel='noopener noreferrer'
            className={`p-3 rounded-full border border-border text-muted-foreground transition-all duration-300 ${social.color}`}
            aria-label={`Partager sur ${social.name}`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <social.icon className='w-4 h-4' />
          </motion.a>
        ))}
      </div>
    </motion.div>
  )
}

// Données factices pour l'exemple avec plus de métadonnées
const mockArticle = {
  id: 'mock-article-1',
  title: 'Les tendances du marché immobilier en 2024',
  date: '27 mai 2024',
  category: 'Marché',
  views: 1247,
  likes: 89,
  comments: 23,
  readTime: '5 min de lecture',
  content: `
    <div class="prose-content">
      <p class="lead text-xl leading-relaxed mb-8 text-muted-foreground">L'immobilier en 2024 connaît des évolutions majeures, façonnées par les nouvelles technologies, les changements démographiques et les préoccupations environnementales. Voici une analyse approfondie des tendances actuelles.</p>
      
      <h2 class="text-2xl font-bold mt-12 mb-6 text-foreground">🌱 L'essor de l'immobilier durable</h2>
      <p class="mb-6 leading-relaxed">La durabilité n'est plus une option mais une nécessité. Les acheteurs recherchent des propriétés économes en énergie, équipées de panneaux solaires, de systèmes de récupération d'eau de pluie et de matériaux écologiques. Cette tendance s'accompagne d'une hausse des prix pour les biens certifiés "verts".</p>
      
      <h2 class="text-2xl font-bold mt-12 mb-6 text-foreground">🏠 L'impact du télétravail</h2>
      <p class="mb-6 leading-relaxed">Avec la généralisation du travail à distance, les critères de choix des logements évoluent. Les espaces de travail à domicile et la qualité de vie deviennent prioritaires. Les périphéries des grandes villes connaissent un regain d'intérêt.</p>
      
      <h2 class="text-2xl font-bold mt-12 mb-6 text-foreground">🚀 Les nouvelles technologies</h2>
      <p class="mb-6 leading-relaxed">La réalité virtuelle pour les visites, les contrats intelligents en blockchain et l'analyse de données prédictives révolutionnent le secteur. Ces innovations accélèrent les transactions et améliorent l'expérience client.</p>
      
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-xl my-8 border border-blue-200 dark:border-blue-800">
        <h3 class="text-lg font-semibold mb-3 text-blue-900 dark:text-blue-100">💡 Point clé</h3>
        <p class="text-blue-800 dark:text-blue-200">Les investisseurs qui s'adaptent rapidement à ces nouvelles tendances auront un avantage concurrentiel significatif sur le marché de demain.</p>
      </div>
    </div>
  `,
  image:
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  author: 'Jean Dupont',
  authorRole: 'Expert Immobilier Senior',
  authorImage:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  tags: ['Marché', 'Tendances', 'Immobilier', 'Innovation']
}

// Déplacer les hooks au niveau supérieur du composant
const useScrollAnimation = () => {
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8])
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95])

  return { headerOpacity, headerScale }
}

export default function ArticlePage () {
  const { slug } = useParams()
  const [isMounted, setIsMounted] = useState(false)
  const { scrollY } = useScroll()
  const headerOpacity = useTransform(scrollY, [0, 200], [1, 0.8])
  const headerScale = useTransform(scrollY, [0, 200], [1, 0.95])
  const parallaxY = useTransform(scrollY, [0, 500], [0, -100])

  // Ici, vous pourriez utiliser le slug pour charger l'article correspondant
  // depuis une API ou une base de données
  const article = mockArticle

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className='min-h-screen bg-background' />
  }

  return (
    <PageLayout title={article.title}>
      {/* Hero Section avec parallax effect */}
      <motion.div
        className='relative min-h-[70vh] flex items-end'
        style={{ opacity: headerOpacity, scale: headerScale }}
      >
        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10' />
        <motion.div className='absolute inset-0' style={{ y: parallaxY }}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            className='object-cover'
            priority
            sizes='100vw'
          />
        </motion.div>

        <div className='relative z-20 container mx-auto px-4 pb-16'>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link
              href='/news'
              className='inline-flex items-center text-white/90 hover:text-white mb-8 group transition-colors backdrop-blur-sm bg-black/20 px-4 py-2 rounded-full'
            >
              <ArrowLeft className='mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform' />
              Retour aux actualités
            </Link>

            <div className='max-w-4xl'>
              <div className='flex flex-wrap gap-2 mb-6'>
                {article.tags?.map((tag, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Badge
                      variant='secondary'
                      className='bg-white/20 text-white border-white/30 backdrop-blur-sm'
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>

              <h1 className='text-4xl md:text-6xl font-bold mb-6 leading-tight text-white'>
                {article.title}
              </h1>

              <div className='flex flex-wrap items-center gap-6 text-white/90 text-sm'>
                <div className='flex items-center backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full'>
                  <UserIcon className='w-4 h-4 mr-2' />
                  {article.author}
                </div>
                <div className='flex items-center backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full'>
                  <Calendar className='w-4 h-4 mr-2' />
                  {article.date}
                </div>
                <div className='flex items-center backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full'>
                  <Clock className='w-4 h-4 mr-2' />
                  {article.readTime}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Content Section */}
      <div className='container mx-auto px-4 py-16 max-w-4xl'>
        {/* Stats Bar */}
        <FadeIn delay={0.1}>
          <Card className='mb-12'>
            <CardContent className='p-6'>
              <div className='flex justify-between items-center'>
                <div className='flex space-x-8'>
                  <div className='flex items-center space-x-2 text-muted-foreground'>
                    <Eye className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      {article.views?.toLocaleString()} vues
                    </span>
                  </div>
                  <div className='flex items-center space-x-2 text-muted-foreground'>
                    <Heart className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      {article.likes} likes
                    </span>
                  </div>
                  <div className='flex items-center space-x-2 text-muted-foreground'>
                    <MessageCircle className='w-4 h-4' />
                    <span className='text-sm font-medium'>
                      {article.comments} commentaires
                    </span>
                  </div>
                </div>
                <motion.button
                  className='flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <BookmarkPlus className='w-4 h-4' />
                  <span className='text-sm font-medium'>Sauvegarder</span>
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Article Content */}
        <motion.article
          className='prose prose-lg dark:prose-invert max-w-none mb-16'
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div
            className='article-content text-lg leading-relaxed text-foreground'
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </motion.article>

        {/* Author Section */}
        <FadeIn delay={0.5}>
          <Card className='mb-12 overflow-hidden'>
            <CardContent className='p-0'>
              <div className='bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-8'>
                <div className='flex items-start space-x-6'>
                  <motion.div
                    className='relative w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg'
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Image
                      src={article.authorImage}
                      alt={article.author}
                      fill
                      className='object-cover'
                    />
                  </motion.div>
                  <div className='flex-1'>
                    <div className='flex items-center space-x-3 mb-2'>
                      <h3 className='text-xl font-bold text-foreground'>
                        {article.author}
                      </h3>
                      <Badge variant='outline' className='text-xs'>
                        <TrendingUp className='w-3 h-3 mr-1' />
                        Expert Vérifié
                      </Badge>
                    </div>
                    <p className='text-sm text-blue-600 dark:text-blue-400 font-medium mb-3'>
                      {article.authorRole}
                    </p>
                    <p className='text-muted-foreground leading-relaxed'>
                      {article.author} est un expert en immobilier avec plus de
                      10 ans d'expérience dans le marché français. Il partage
                      régulièrement son analyse des tendances du marché et
                      accompagne les investisseurs dans leurs projets
                      immobiliers.
                    </p>
                    <div className='flex space-x-4 mt-4'>
                      <motion.button
                        className='text-sm text-blue-600 hover:text-blue-800 font-medium'
                        whileHover={{ scale: 1.05 }}
                      >
                        Voir tous ses articles
                      </motion.button>
                      <motion.button
                        className='text-sm text-muted-foreground hover:text-foreground font-medium'
                        whileHover={{ scale: 1.05 }}
                      >
                        Suivre l'auteur
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Share Section */}
        <FadeIn delay={0.6}>
          <ShareButtons title={article.title} url={`/news/${slug}`} />
        </FadeIn>

        {/* Related Articles */}
        <SlideIn direction='up' delay={0.7}>
          <div className='mt-20'>
            <div className='flex items-center space-x-3 mb-8'>
              <h2 className='text-3xl font-bold'>Articles similaires</h2>
              <Badge variant='secondary'>
                <TrendingUp className='w-3 h-3 mr-1' />
                Tendance
              </Badge>
            </div>
            <div className='grid md:grid-cols-2 gap-8'>
              {[
                {
                  id: 1,
                  category: 'Investissement',
                  title: "Comment investir dans l'immobilier en 2024",
                  description:
                    "Découvrez les meilleures stratégies pour investir dans l'immobilier cette année et maximiser vos rendements.",
                  image:
                    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&crop=center',
                  readTime: '7 min',
                  views: 2340
                },
                {
                  id: 2,
                  category: 'Tendances',
                  title: 'Les villes les plus dynamiques de France',
                  description:
                    'Analyse des marchés immobiliers les plus porteurs en France avec des données exclusives.',
                  image:
                    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center',
                  readTime: '5 min',
                  views: 1890
                }
              ].map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                >
                  <Card className='overflow-hidden hover:shadow-xl transition-all duration-300 group'>
                    <div className='relative h-56 overflow-hidden'>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className='object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      <div className='absolute top-4 left-4'>
                        <Badge
                          variant='secondary'
                          className='bg-white/90 text-foreground'
                        >
                          {item.category}
                        </Badge>
                      </div>
                      <div className='absolute bottom-4 right-4 flex space-x-2'>
                        <Badge
                          variant='outline'
                          className='bg-black/50 text-white border-white/30 backdrop-blur-sm text-xs'
                        >
                          <Clock className='w-3 h-3 mr-1' />
                          {item.readTime}
                        </Badge>
                        <Badge
                          variant='outline'
                          className='bg-black/50 text-white border-white/30 backdrop-blur-sm text-xs'
                        >
                          <Eye className='w-3 h-3 mr-1' />
                          {item.views}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className='p-6'>
                      <h3 className='text-xl font-bold mb-3 group-hover:text-blue-600 transition-colors'>
                        {item.title}
                      </h3>
                      <p className='text-muted-foreground text-sm mb-4 leading-relaxed'>
                        {item.description}
                      </p>
                      <Link
                        href={`/news/article-${item.id}`}
                        className='inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm group-hover:translate-x-1 transition-transform'
                      >
                        Lire la suite
                        <motion.svg
                          className='w-4 h-4 ml-1'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          whileHover={{ x: 5 }}
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 5l7 7-7 7'
                          />
                        </motion.svg>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </SlideIn>
      </div>
    </PageLayout>
  )
}
