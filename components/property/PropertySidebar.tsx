'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Heart, Phone, Globe, Mail, MessageSquare } from "lucide-react";
import { PropertySeedData } from "@/lib/seed-data";

interface PropertySidebarProps {
  property: PropertySeedData;
}

export function PropertySidebar({ property }: PropertySidebarProps) {
  const formatPrice = (price: number, transactionType: string) => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(price);
    return transactionType === 'rent' ? `${formatted}/mois` : formatted;
  };

  return (
    <div className='space-y-6'>
      {/* Contact Agent - Enhanced */}
      {property.agent && (
        <Card>
          <CardHeader>
            <CardTitle>Contact Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className='w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                <span className='text-white font-bold text-xl'>
                  {property.agent.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </span>
              </div>
              <div className="flex-1">
                <h3 className='font-semibold text-lg mb-1'>{property.agent.name}</h3>
                <p className='text-gray-600 mb-2'>{property.agent.company}</p>
                <div className="flex items-center gap-4">
                  <div className='flex items-center gap-2 text-sm text-blue-600'>
                    <Phone className='w-4 h-4' />
                    <span>{property.agent.phone}</span>
                  </div>
                  <div className='flex items-center gap-2 text-sm text-blue-600'>
                    <Globe className='w-4 h-4' />
                    <span>WhatsApp</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <Button className='w-full bg-blue-600 hover:bg-blue-700'>
                <Phone className='w-4 h-4 mr-2' />
                Call Agent
              </Button>
              <Button variant="outline" className='w-full'>
                <Mail className='w-4 h-4 mr-2' />
                Send Email
              </Button>
              <Button variant="outline" className='w-full'>
                <MessageSquare className='w-4 h-4 mr-2' />
                Send Message
              </Button>
            </div>
            
            {/* Contact Form */}
            <div className="space-y-4">
              <h4 className="font-medium">Quick Inquiry</h4>
              <div className="space-y-3">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="email" 
                  placeholder="Your Email" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input 
                  type="tel" 
                  placeholder="Your Phone" 
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea 
                  placeholder="Your Message"
                  rows={3}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <Button className="w-full">
                  Send Inquiry
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Schedule Tour */}
      <Card>
        <CardHeader>
          <CardTitle>Schedule a Tour</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">In Person</Button>
            <Button variant="outline" size="sm">Video Chat</Button>
          </div>
          <input 
            type="date" 
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Select Time</option>
            <option>9:00 AM</option>
            <option>10:00 AM</option>
            <option>11:00 AM</option>
            <option>2:00 PM</option>
            <option>3:00 PM</option>
            <option>4:00 PM</option>
          </select>
          <Button className="w-full">
            Schedule Tour
          </Button>
        </CardContent>
      </Card>

      {/* Property Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Property Statistics</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center justify-between py-2 border-b'>
            <div className='flex items-center gap-2'>
              <Eye className='w-5 h-5 text-blue-600' />
              <span className='font-medium'>Views</span>
            </div>
            <span className='font-bold text-lg'>{property.views}</span>
          </div>
          <div className='flex items-center justify-between py-2 border-b'>
            <div className='flex items-center gap-2'>
              <Heart className='w-5 h-5 text-red-500' />
              <span className='font-medium'>Favorites</span>
            </div>
            <span className='font-bold text-lg'>{property.favorites}</span>
          </div>
          <div className='flex items-center justify-between py-2'>
            <div className='flex items-center gap-2'>
              <MessageSquare className='w-5 h-5 text-green-600' />
              <span className='font-medium'>Inquiries</span>
            </div>
            <span className='font-bold text-lg'>{property.inquiries}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Mortgage Calculator */}
      <Card>
        <CardHeader>
          <CardTitle>Mortgage Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700">Loan Amount</label>
              <input 
                type="text" 
                value={formatPrice(property.price * 0.8, 'sale')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Interest Rate (%)</label>
              <input 
                type="number" 
                defaultValue="3.5"
                step="0.1"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Loan Term (years)</label>
              <select defaultValue="25" className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                 <option value="15">15 years</option>
                 <option value="20">20 years</option>
                 <option value="25">25 years</option>
                 <option value="30">30 years</option>
               </select>
            </div>
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="font-medium">Monthly Payment:</span>
                <span className="font-bold text-lg text-blue-600">
                  {formatPrice(Math.round((property.price * 0.8 * 0.035 / 12) / (1 - Math.pow(1 + 0.035/12, -25*12)) * 100) / 100, 'rent')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default PropertySidebar;