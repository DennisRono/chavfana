import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Sprout,
  TrendingUp,
  Users,
  Shield,
  Smartphone,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Twitter,
  Facebook,
  Linkedin,
  Star,
  CheckCircle,
  ArrowRight,
  DollarSign,
  Truck,
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Homepage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-2">
        <div className="container mx-auto flex h-16 items-center justify-between">
          <Link className="flex items-center gap-2" href="/">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">ChavFana</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#services"
              className="text-md font-medium hover:text-primary transition-colors"
            >
              Services
            </a>
            <a
              href="#about"
              className="text-md font-medium hover:text-primary transition-colors"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-md font-medium hover:text-primary transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-md font-medium hover:text-primary transition-colors"
            >
              Contact
            </a>
          </nav>
          <Link href="/login">
            <Button className="cursor-pointer">Sign in/Sign up</Button>
          </Link>
        </div>
      </header>

      <section className="py-20 px-4 relative min-h-[70vh]">
        <div className="absolute inset-0 z-0">
          <Image
            src="/modern-farm-with-green-fields-and-farming-equipmen.jpg"
            alt="Modern farming landscape"
            fill
            className="object-cover opacity-20"
          />
        </div>
        <div className="container mx-auto text-center relative z-10 flex flex-col items-center justify-center">
          <Badge variant="secondary" className="mb-4">
            Smart farming made simple
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            The Ultimate <span className="text-primary">Farm Management</span>{' '}
            System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            ChavFana helps farmers, agribusinesses, and cooperatives plan,
            monitor, and grow smarter with digital tools that simplify farm
            management and increase productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="text-lg px-8">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent"
            >
              Watch Demo
            </Button>
          </div>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">5K+</div>
              <div className="text-sm text-muted-foreground">
                Active Farmers
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-muted-foreground">
                Farms Digitized
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">User Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">3</div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Comprehensive Farm Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your farm efficiently in one
              integrated platform
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/farmer-using-tablet-in-green-crop-field-with-plant.jpg"
                    alt="Farm management with technology"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Sprout className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Farm Management</CardTitle>
                <CardDescription>
                  Track crops, livestock, and resources in one centralized
                  system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Crop Planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Livestock Tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Inventory Management</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Farm Reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/farmer-counting-money-with-calculator-and-farm-pro.jpg"
                    alt="Farm financial management"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Financial Tools</CardTitle>
                <CardDescription>
                  Stay on top of farm finances with smart accounting and
                  insights
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Expense Tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Revenue Forecasting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Budget Planning</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Loan & Grant Management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="/modern-farming-truck-loading-fresh-vegetables-and-.jpg"
                    alt="Farm supply chain and logistics"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Supply Chain & Logistics</CardTitle>
                <CardDescription>
                  Connect farms to markets and manage delivery with ease
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Marketplace Integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Produce Distribution</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">Delivery Tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span className="text-sm">
                      Storage & Cold Chain Support
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose ChavFana?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built specifically for African farmers with features that matter
              most
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Mobile First</h3>
              <p className="text-muted-foreground text-sm">
                Works perfectly on any device, even with limited internet
                connectivity
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground text-sm">
                Get insights that help you make better farming decisions
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-muted-foreground text-sm">
                Your farm data is protected with enterprise-grade security
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Community Driven</h3>
              <p className="text-muted-foreground text-sm">
                Connect with other farmers and share knowledge
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                To empower farmers and agribusinesses with digital tools that
                simplify farm management and increase productivity.
              </p>
              <p className="text-muted-foreground mb-8">
                ChavFana is dedicated to making farming smarter by providing a
                reliable platform that tracks crops, livestock, finances, and
                logistics seamlessly. We envision a future where every farmer,
                from smallholders to large cooperatives, uses ChavFana to thrive
                and feed communities.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Sustainability</h4>
                  <p className="text-sm text-muted-foreground">
                    Building solutions that promote eco-friendly farming
                    practices
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Innovation</h4>
                  <p className="text-sm text-muted-foreground">
                    Delivering cutting-edge tools to improve farm productivity
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Community</h4>
                  <p className="text-sm text-muted-foreground">
                    Empowering farmers and cooperatives to grow together
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Integrity</h4>
                  <p className="text-sm text-muted-foreground">
                    Transparency and reliability in every interaction
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                <Image
                  src="/happy-african-farmers-working-together-in-green-ve.jpg"
                  alt="Happy farmers working together"
                  fill
                  className="object-cover"
                />
              </div>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="font-semibold">Growing Impact</h3>
                      <p className="text-sm text-muted-foreground">
                        Expanding across Africa's agritech ecosystem
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">50+</div>
                      <div className="text-xs text-muted-foreground">
                        Team Members
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">3</div>
                      <div className="text-xs text-muted-foreground">
                        Countries
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Modern Farming Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how technology is transforming agriculture across Africa
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/modern-tractor-with-gps-technology-working-in-larg.jpg"
                alt="Modern farming equipment"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold mb-1">Smart Machinery</h3>
                <p className="text-sm opacity-90">
                  GPS-guided farming equipment
                </p>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/drone-flying-over-green-crops-field-for-monitoring.jpg"
                alt="Drone technology in farming"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold mb-1">Drone Monitoring</h3>
                <p className="text-sm opacity-90">Aerial crop surveillance</p>
              </div>
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden">
              <Image
                src="/automated-irrigation-system-watering-green-plants-.jpg"
                alt="Smart irrigation system"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-semibold mb-1">Smart Irrigation</h3>
                <p className="text-sm opacity-90">Automated water management</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet Our Leadership
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experienced leaders driving innovation in African agriculture
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/dennis-kibet-ceo.jpg" />
                  <AvatarFallback>DK</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">Dennis Kibet</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Founder & CEO
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Agritech enthusiast with a passion for transforming farming
                  through technology
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Twitter className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/alice-wanjiku-coo.jpg" />
                  <AvatarFallback>AW</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">Alice Wanjiku</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Chief Operations Officer
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Expert in agribusiness operations and farmer relations
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/james-otieno-cto.jpg" />
                  <AvatarFallback>JO</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">James Otieno</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Chief Technology Officer
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Platform engineering expert specializing in AgriTech solutions
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Avatar className="w-20 h-20 mx-auto mb-4">
                  <AvatarImage src="/grace-mwangi-cmo.jpg" />
                  <AvatarFallback>GM</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold mb-1">Grace Mwangi</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Chief Marketing Officer
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  AgriTech growth specialist and community engagement expert
                </p>
                <div className="flex justify-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Linkedin className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="testimonials" className="py-20 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              What Farmers Say
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Real stories from farmers who transformed their operations with
              ChavFana
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "ChavFana helps me track milk production and manage my farm
                  finances better than ever."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/john-mwangi-farmer.jpg" />
                    <AvatarFallback>JM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">John Mwangi</p>
                    <p className="text-xs text-muted-foreground">
                      Mwangi Dairy Farm
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The system simplified my operations — from planning crops to
                  selling produce at the market."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/sarah-atieno-agribusiness.jpg" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">Sarah Atieno</p>
                    <p className="text-xs text-muted-foreground">
                      GreenHarvest
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-primary text-primary"
                    />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "With ChavFana, we've improved transparency and boosted member
                  satisfaction."
                </p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/peter-kamau-cooperative.jpg" />
                    <AvatarFallback>PK</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">Peter Kamau</p>
                    <p className="text-xs text-muted-foreground">
                      AgriGrow Co-op
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Trusted Partners
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Working with leading organizations to transform African
              agriculture
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <div className="text-2xl font-bold">Safaricom</div>
            <div className="text-2xl font-bold">M-Pesa</div>
            <div className="text-2xl font-bold">USAID</div>
            <div className="text-2xl font-bold">FAO</div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of farmers already using ChavFana to grow smarter and
            more efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      <footer id="contact" className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Sprout className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">ChavFana</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Smart farming made simple. The future of farming, today.
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Twitter className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Facebook className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Farm Management
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Financial Tools
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Supply Chain
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>GreenHub Towers, Nairobi, Kenya</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+254-701-234-567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>support@chavfana.com</span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-8" />

          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2025 ChavFana. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-foreground transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
