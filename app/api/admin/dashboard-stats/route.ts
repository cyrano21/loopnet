import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Récupérer les statistiques des utilisateurs
    const users = await prisma.user.findMany();
    const userStats = {
      total: users.length,
      admin: users.filter(user => user.role === 'ADMIN').length,
      agent: users.filter(user => user.role === 'AGENT').length,
      premium: users.filter(user => user.plan === 'PREMIUM').length,
      simple: users.filter(user => user.plan === 'BASIC').length,
      guest: users.filter(user => !user.role).length,
    };

    // Récupérer les statistiques des propriétés
    const properties = await prisma.property.findMany();
    const propertyStats = {
      total: properties.length,
      active: properties.filter(prop => prop.status === 'ACTIVE').length,
      pending: properties.filter(prop => prop.status === 'PENDING').length,
    };

    // Statistiques de revenus (simulées pour l'exemple)
    const revenueStats = {
      monthly: 28473.92,
      yearly: 341687.04
    };

    // Statistiques d'activité (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const propertiesAddedThisMonth = await prisma.property.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const activityStats = {
      newUsersThisMonth,
      propertiesAddedThisMonth
    };

    return NextResponse.json({
      users: userStats,
      properties: propertyStats,
      revenue: revenueStats,
      activity: activityStats
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}
