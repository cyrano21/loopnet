import { NextResponse } from 'next/server';
import User from '@/models/User';
import Property from '@/models/Property';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    // Connexion à la base de données
    await connectToDatabase();

    // Récupérer les statistiques des utilisateurs
    const users = await User.find({});
    const userStats = {
      total: users.length,
      admin: users.filter(user => user.role === 'admin').length,
      agent: users.filter(user => user.role === 'agent').length,
      premium: users.filter(user => user.subscription?.plan === 'premium').length,
      basic: users.filter(user => user.subscription?.plan === 'basic').length,
      free: users.filter(user => user.subscription?.plan === 'free' || !user.subscription?.plan).length,
    };

    // Récupérer les statistiques des propriétés
    const properties = await Property.find({});
    const propertyStats = {
      total: properties.length,
      active: properties.filter(prop => prop.status === 'active').length,
      pending: properties.filter(prop => prop.status === 'pending').length,
    };

    // Statistiques de revenus (simulées pour l'exemple)
    const revenueStats = {
      monthly: 28473.92,
      yearly: 341687.04
    };

    // Statistiques d'activité (30 derniers jours)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: {
        $gte: thirtyDaysAgo
      }
    });

    const propertiesAddedThisMonth = await Property.countDocuments({
      createdAt: {
        $gte: thirtyDaysAgo
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
