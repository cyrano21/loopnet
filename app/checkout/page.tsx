'use client'

import type React from 'react'

import { useState, useEffect, useMemo } from 'react'
import { CreditCard, Lock, Check, Building2 } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

export default function CheckoutPage () {
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)
  const [billingCycle, setBillingCycle] = useState('monthly')

  const plans = useMemo(() => ({
    basic: { name: 'Basic', monthlyPrice: 29, annualPrice: 290 },
    professional: { name: 'Professional', monthlyPrice: 99, annualPrice: 990 },
    enterprise: { name: 'Enterprise', monthlyPrice: 299, annualPrice: 2990 }
  }), [])

  useEffect(() => {
    const plan = searchParams.get('plan') || 'professional'
    const billing = searchParams.get('billing') || 'monthly'
    setSelectedPlan(plans[plan as keyof typeof plans])
    setBillingCycle(billing)
  }, [searchParams, plans])

  const [formData, setFormData] = useState({
    // Company Information
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',

    // Billing Address
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',

    // Payment Information
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',

    // Preferences
    agreeToTerms: false,
    subscribeToUpdates: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Integrate with Stripe or payment processor
      const response = await fetch('/api/payments/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          plan: selectedPlan?.name.toLowerCase(),
          billingCycle,
          customerData: formData
        })
      })

      if (response.ok) {
        const data = await response.json()
        // Redirect to success page or dashboard
        window.location.href = '/dashboard?welcome=true'
      } else {
        console.error('Payment failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!selectedPlan) {
    return <div>Loading...</div>
  }

  const price =
    billingCycle === 'annual'
      ? selectedPlan.annualPrice
      : selectedPlan.monthlyPrice
  const monthlyPrice =
    billingCycle === 'annual'
      ? Math.floor(selectedPlan.annualPrice / 12)
      : selectedPlan.monthlyPrice
  const savings =
    billingCycle === 'annual'
      ? selectedPlan.monthlyPrice * 12 - selectedPlan.annualPrice
      : 0

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='border-b bg-white'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-16'>
            <Link href='/' className='flex items-center space-x-2'>
              <Building2 className='h-8 w-8 text-blue-600' />
              <span className='text-2xl font-bold text-blue-600'>LoopNet</span>
            </Link>
            <div className='flex items-center space-x-2'>
              <Lock className='h-4 w-4 text-green-600' />
              <span className='text-sm text-gray-600'>Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* Main Form */}
            <div className='lg:col-span-2'>
              <form onSubmit={handleSubmit} className='space-y-8'>
                {/* Company Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div>
                      <Label htmlFor='companyName'>Company Name</Label>
                      <Input
                        id='companyName'
                        required
                        value={formData.companyName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            companyName: e.target.value
                          })
                        }
                        placeholder='Your Company Name'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='firstName'>First Name</Label>
                        <Input
                          id='firstName'
                          required
                          value={formData.firstName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              firstName: e.target.value
                            })
                          }
                          placeholder='John'
                        />
                      </div>
                      <div>
                        <Label htmlFor='lastName'>Last Name</Label>
                        <Input
                          id='lastName'
                          required
                          value={formData.lastName}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              lastName: e.target.value
                            })
                          }
                          placeholder='Smith'
                        />
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='email'>Email Address</Label>
                        <Input
                          id='email'
                          type='email'
                          required
                          value={formData.email}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder='john@company.com'
                        />
                      </div>
                      <div>
                        <Label htmlFor='phone'>Phone Number</Label>
                        <Input
                          id='phone'
                          type='tel'
                          value={formData.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder='(555) 123-4567'
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Billing Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Billing Address</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div>
                      <Label htmlFor='address'>Street Address</Label>
                      <Input
                        id='address'
                        required
                        value={formData.address}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder='123 Business Street'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='city'>City</Label>
                        <Input
                          id='city'
                          required
                          value={formData.city}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder='San Francisco'
                        />
                      </div>
                      <div>
                        <Label htmlFor='state'>State</Label>
                        <Select
                          value={formData.state}
                          onValueChange={value =>
                            setFormData({ ...formData, state: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Select state' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='CA'>California</SelectItem>
                            <SelectItem value='NY'>New York</SelectItem>
                            <SelectItem value='TX'>Texas</SelectItem>
                            <SelectItem value='FL'>Florida</SelectItem>
                            {/* Add more states */}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='zipCode'>ZIP Code</Label>
                        <Input
                          id='zipCode'
                          required
                          value={formData.zipCode}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              zipCode: e.target.value
                            })
                          }
                          placeholder='94105'
                        />
                      </div>
                      <div>
                        <Label htmlFor='country'>Country</Label>
                        <Select
                          value={formData.country}
                          onValueChange={value =>
                            setFormData({ ...formData, country: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='US'>United States</SelectItem>
                            <SelectItem value='CA'>Canada</SelectItem>
                            <SelectItem value='UK'>United Kingdom</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      <CreditCard className='h-5 w-5' />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    <div>
                      <Label htmlFor='nameOnCard'>Name on Card</Label>
                      <Input
                        id='nameOnCard'
                        required
                        value={formData.nameOnCard}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            nameOnCard: e.target.value
                          })
                        }
                        placeholder='John Smith'
                      />
                    </div>
                    <div>
                      <Label htmlFor='cardNumber'>Card Number</Label>
                      <Input
                        id='cardNumber'
                        required
                        value={formData.cardNumber}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setFormData({
                            ...formData,
                            cardNumber: e.target.value
                          })
                        }
                        placeholder='1234 5678 9012 3456'
                        maxLength={19}
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <Label htmlFor='expiryDate'>Expiry Date</Label>
                        <Input
                          id='expiryDate'
                          required
                          value={formData.expiryDate}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({
                              ...formData,
                              expiryDate: e.target.value
                            })
                          }
                          placeholder='MM/YY'
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor='cvv'>CVV</Label>
                        <Input
                          id='cvv'
                          required
                          value={formData.cvv}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setFormData({ ...formData, cvv: e.target.value })
                          }
                          placeholder='123'
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Terms and Conditions */}
                <Card>
                  <CardContent className='pt-6'>
                    <div className='space-y-4'>
                      <div className='flex items-start space-x-2'>
                        <Checkbox
                          id='terms'
                          required
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({ ...formData, agreeToTerms: checked })
                          }
                        />
                        <Label htmlFor='terms' className='text-sm leading-5'>
                          I agree to the{' '}
                          <Link
                            href='/terms'
                            className='text-blue-600 hover:text-blue-500'
                          >
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link
                            href='/privacy'
                            className='text-blue-600 hover:text-blue-500'
                          >
                            Privacy Policy
                          </Link>
                        </Label>
                      </div>
                      <div className='flex items-start space-x-2'>
                        <Checkbox
                          id='updates'
                          checked={formData.subscribeToUpdates}
                          onCheckedChange={(checked: boolean) =>
                            setFormData({
                              ...formData,
                              subscribeToUpdates: checked
                            })
                          }
                        />
                        <Label htmlFor='updates' className='text-sm leading-5'>
                          Subscribe to product updates and marketing emails
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Button
                  type='submit'
                  size='lg'
                  className='w-full'
                  disabled={isLoading}
                >
                  {isLoading
                    ? 'Processing...'
                    : `Complete Purchase - $${price}`}
                </Button>
              </form>
            </div>

            {/* Order Summary */}
            <div className='lg:col-span-1'>
              <Card className='sticky top-8'>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <div className='flex justify-between items-center'>
                    <span className='font-medium'>
                      {selectedPlan.name} Plan
                    </span>
                    <Badge variant='outline'>{billingCycle}</Badge>
                  </div>

                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span>Plan Price</span>
                      <span>${monthlyPrice}/month</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <>
                        <div className='flex justify-between text-green-600'>
                          <span>Annual Discount</span>
                          <span>-${savings}</span>
                        </div>
                        <div className='flex justify-between'>
                          <span>Billed Today</span>
                          <span>${selectedPlan.annualPrice}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <Separator />

                  <div className='flex justify-between font-semibold text-lg'>
                    <span>Total</span>
                    <span>${price}</span>
                  </div>

                  {billingCycle === 'annual' && (
                    <div className='text-center text-sm text-green-600 font-medium'>
                      You save ${savings} per year!
                    </div>
                  )}

                  <div className='space-y-2 text-sm text-gray-600'>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>14-day free trial</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>Cancel anytime</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Check className='h-4 w-4 text-green-600' />
                      <span>24/7 support</span>
                    </div>
                  </div>

                  <div className='bg-blue-50 p-4 rounded-lg'>
                    <h4 className='font-medium text-blue-900 mb-2'>
                      What's Included:
                    </h4>
                    <ul className='text-sm text-blue-800 space-y-1'>
                      {selectedPlan.name === 'Basic' && (
                        <>
                          <li>• Up to 5 property listings</li>
                          <li>• Basic analytics</li>
                          <li>• Email support</li>
                        </>
                      )}
                      {selectedPlan.name === 'Professional' && (
                        <>
                          <li>• Up to 25 property listings</li>
                          <li>• Advanced analytics & CRM</li>
                          <li>• AI-powered descriptions</li>
                          <li>• Priority support</li>
                        </>
                      )}
                      {selectedPlan.name === 'Enterprise' && (
                        <>
                          <li>• Unlimited listings</li>
                          <li>• Advanced AI analytics</li>
                          <li>• White-label solution</li>
                          <li>• Dedicated support</li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
