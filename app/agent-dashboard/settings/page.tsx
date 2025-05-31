'use client'

import { useState, useEffect } from 'react'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Smartphone, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Save, 
  Upload, 
  Trash2, 
  Key, 
  Database, 
  Download, 
  Settings as SettingsIcon,
  Palette,
  Moon,
  Sun,
  Monitor,
  Languages,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Percent,
  Building,
  Phone,
  FileText,
  Camera,
  Edit,
  Check,
  X
} from 'lucide-react'
import { RoleGuard } from '@/components/role-guard'
import { useAuth } from '@/hooks/use-auth'

// Types pour les paramètres
interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  avatar: string
  company: string
  position: string
  address: string
  city: string
  postalCode: string
  country: string
  website: string
  linkedin: string
}

interface NotificationSettings {
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  marketingEmails: boolean
  newLeads: boolean
  propertyUpdates: boolean
  appointmentReminders: boolean
  systemUpdates: boolean
  weeklyReports: boolean
  monthlyReports: boolean
}

interface SecuritySettings {
  twoFactorAuth: boolean
  loginAlerts: boolean
  sessionTimeout: number
  passwordExpiry: number
  allowedIPs: string[]
}

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  dateFormat: string
  currency: string
  numberFormat: string
}

interface BusinessSettings {
  commissionRate: number
  defaultPropertyType: string
  autoAssignLeads: boolean
  workingHours: {
    start: string
    end: string
    days: string[]
  }
  responseTime: number
  signature: string
}

export default function AgentSettingsPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('profile')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // États pour les différents paramètres
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.name?.split(' ')[0] || 'Jean',
    lastName: user?.name?.split(' ').slice(1).join(' ') || 'Dupont',
    email: user?.email || 'jean.dupont@example.com',
    phone: '+33 1 23 45 67 89',
    bio: 'Agent immobilier spécialisé dans l\'immobilier commercial avec plus de 10 ans d\'expérience.',
    avatar: '',
    company: 'Immobilier Pro',
    position: 'Agent Senior',
    address: '123 Rue de la Paix',
    city: 'Paris',
    postalCode: '75001',
    country: 'France',
    website: 'https://www.example.com',
    linkedin: 'https://linkedin.com/in/jeandupont'
  })

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    marketingEmails: false,
    newLeads: true,
    propertyUpdates: true,
    appointmentReminders: true,
    systemUpdates: true,
    weeklyReports: true,
    monthlyReports: false
  })

  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    allowedIPs: []
  })

  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: 'system',
    language: 'fr',
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    numberFormat: 'fr-FR'
  })

  const [business, setBusiness] = useState<BusinessSettings>({
    commissionRate: 3.5,
    defaultPropertyType: 'bureau',
    autoAssignLeads: true,
    workingHours: {
      start: '09:00',
      end: '18:00',
      days: ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi']
    },
    responseTime: 2,
    signature: 'Cordialement,\nJean Dupont\nAgent Immobilier\nTél: +33 1 23 45 67 89'
  })

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')

  const handleSave = async () => {
    setIsLoading(true)
    // Simulation d'une sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setHasChanges(false)
    // Ici, vous ajouteriez la logique pour sauvegarder les paramètres
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }
    setIsLoading(true)
    // Simulation du changement de mot de passe
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setNewPassword('')
    setConfirmPassword('')
    setCurrentPassword('')
    alert('Mot de passe modifié avec succès')
  }

  const handleExportData = () => {
    // Simulation de l'export des données
    const data = {
      profile,
      notifications,
      security: { ...security, allowedIPs: security.allowedIPs },
      appearance,
      business
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mes-donnees.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAccount = async () => {
    // Ici, vous ajouteriez la logique pour supprimer le compte
    alert('Fonctionnalité de suppression de compte à implémenter')
  }

  return (
    <RoleGuard allowedRoles={['agent', 'admin']} message="Vous devez être un agent pour accéder à cette page.">
      <div className="w-full px-4 py-8">
        <div className="flex flex-col space-y-8">
          {/* En-tête */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Paramètres</h1>
              <p className="text-gray-500 mt-1">
                Gérez vos préférences et paramètres de compte
              </p>
            </div>
            <div className="flex gap-2">
              {hasChanges && (
                <Button onClick={handleSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              )}
            </div>
          </div>

          {/* Onglets pour les différentes sections */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Sécurité
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Palette className="h-4 w-4 mr-2" />
                Apparence
              </TabsTrigger>
              <TabsTrigger value="business">
                <Building className="h-4 w-4 mr-2" />
                Business
              </TabsTrigger>
            </TabsList>

            {/* Profil */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>
                    Gérez vos informations de profil public
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Photo de profil */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                        {profile.avatar ? (
                          <img src={profile.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <Button size="sm" className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0">
                        <Camera className="h-4 w-4" />
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-medium">Photo de profil</h3>
                      <p className="text-sm text-gray-500 mb-2">
                        Formats acceptés: JPG, PNG. Taille max: 5MB
                      </p>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Télécharger
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Prénom</Label>
                      <Input
                        id="firstName"
                        value={profile.firstName}
                        onChange={(e) => {
                          setProfile({...profile, firstName: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Nom</Label>
                      <Input
                        id="lastName"
                        value={profile.lastName}
                        onChange={(e) => {
                          setProfile({...profile, lastName: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e) => {
                          setProfile({...profile, email: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        value={profile.phone}
                        onChange={(e) => {
                          setProfile({...profile, phone: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Biographie</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => {
                        setProfile({...profile, bio: e.target.value})
                        setHasChanges(true)
                      }}
                      rows={3}
                      placeholder="Décrivez votre expérience et spécialités..."
                    />
                  </div>

                  <Separator />

                  {/* Informations professionnelles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="company">Entreprise</Label>
                      <Input
                        id="company"
                        value={profile.company}
                        onChange={(e) => {
                          setProfile({...profile, company: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position">Poste</Label>
                      <Input
                        id="position"
                        value={profile.position}
                        onChange={(e) => {
                          setProfile({...profile, position: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  </div>

                  <Separator />

                  {/* Adresse */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Adresse</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Adresse</Label>
                      <Input
                        id="address"
                        value={profile.address}
                        onChange={(e) => {
                          setProfile({...profile, address: e.target.value})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">Ville</Label>
                        <Input
                          id="city"
                          value={profile.city}
                          onChange={(e) => {
                            setProfile({...profile, city: e.target.value})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode">Code postal</Label>
                        <Input
                          id="postalCode"
                          value={profile.postalCode}
                          onChange={(e) => {
                            setProfile({...profile, postalCode: e.target.value})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="country">Pays</Label>
                        <Select value={profile.country} onValueChange={(value) => {
                          setProfile({...profile, country: value})
                          setHasChanges(true)
                        }}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Belgique">Belgique</SelectItem>
                            <SelectItem value="Suisse">Suisse</SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Liens sociaux */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Liens professionnels</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="website">Site web</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => {
                            setProfile({...profile, website: e.target.value})
                            setHasChanges(true)
                          }}
                          placeholder="https://www.example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profile.linkedin}
                          onChange={(e) => {
                            setProfile({...profile, linkedin: e.target.value})
                            setHasChanges(true)
                          }}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Préférences de notification</CardTitle>
                  <CardDescription>
                    Choisissez comment vous souhaitez être notifié
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Canaux de notification */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Canaux de notification</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail className="h-5 w-5 text-blue-500" />
                          <div>
                            <div className="font-medium">Notifications par email</div>
                            <div className="text-sm text-gray-500">Recevez des notifications par email</div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.emailNotifications}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, emailNotifications: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Smartphone className="h-5 w-5 text-green-500" />
                          <div>
                            <div className="font-medium">Notifications SMS</div>
                            <div className="text-sm text-gray-500">Recevez des notifications par SMS</div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.smsNotifications}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, smsNotifications: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell className="h-5 w-5 text-purple-500" />
                          <div>
                            <div className="font-medium">Notifications push</div>
                            <div className="text-sm text-gray-500">Recevez des notifications dans le navigateur</div>
                          </div>
                        </div>
                        <Switch
                          checked={notifications.pushNotifications}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, pushNotifications: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Types de notifications */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Types de notifications</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Nouveaux prospects</div>
                          <div className="text-sm text-gray-500">Notification lors de l'arrivée de nouveaux prospects</div>
                        </div>
                        <Switch
                          checked={notifications.newLeads}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, newLeads: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Mises à jour de propriétés</div>
                          <div className="text-sm text-gray-500">Notification lors de modifications de vos propriétés</div>
                        </div>
                        <Switch
                          checked={notifications.propertyUpdates}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, propertyUpdates: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Rappels de rendez-vous</div>
                          <div className="text-sm text-gray-500">Rappels avant vos rendez-vous</div>
                        </div>
                        <Switch
                          checked={notifications.appointmentReminders}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, appointmentReminders: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Mises à jour système</div>
                          <div className="text-sm text-gray-500">Notifications importantes du système</div>
                        </div>
                        <Switch
                          checked={notifications.systemUpdates}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, systemUpdates: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Rapports */}
                  <div className="space-y-4">
                    <h3 className="font-medium">Rapports automatiques</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Rapports hebdomadaires</div>
                          <div className="text-sm text-gray-500">Résumé de votre activité chaque semaine</div>
                        </div>
                        <Switch
                          checked={notifications.weeklyReports}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, weeklyReports: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Rapports mensuels</div>
                          <div className="text-sm text-gray-500">Bilan complet de votre activité mensuelle</div>
                        </div>
                        <Switch
                          checked={notifications.monthlyReports}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, monthlyReports: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Emails marketing</div>
                          <div className="text-sm text-gray-500">Conseils et actualités du secteur</div>
                        </div>
                        <Switch
                          checked={notifications.marketingEmails}
                          onCheckedChange={(checked) => {
                            setNotifications({...notifications, marketingEmails: checked})
                            setHasChanges(true)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sécurité */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Mot de passe</CardTitle>
                  <CardDescription>
                    Modifiez votre mot de passe pour sécuriser votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <Button onClick={handlePasswordChange} disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}>
                    <Key className="h-4 w-4 mr-2" />
                    {isLoading ? 'Modification...' : 'Modifier le mot de passe'}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Authentification à deux facteurs</CardTitle>
                  <CardDescription>
                    Ajoutez une couche de sécurité supplémentaire à votre compte
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Authentification à deux facteurs</div>
                      <div className="text-sm text-gray-500">
                        {security.twoFactorAuth ? 'Activée' : 'Désactivée'}
                      </div>
                    </div>
                    <Switch
                      checked={security.twoFactorAuth}
                      onCheckedChange={(checked) => {
                        setSecurity({...security, twoFactorAuth: checked})
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  {security.twoFactorAuth && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="text-sm text-blue-700">
                        L'authentification à deux facteurs est activée. Vous recevrez un code par SMS lors de vos connexions.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Paramètres de sécurité</CardTitle>
                  <CardDescription>
                    Configurez les paramètres de sécurité avancés
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Alertes de connexion</div>
                      <div className="text-sm text-gray-500">Être notifié des nouvelles connexions</div>
                    </div>
                    <Switch
                      checked={security.loginAlerts}
                      onCheckedChange={(checked) => {
                        setSecurity({...security, loginAlerts: checked})
                        setHasChanges(true)
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="sessionTimeout">Délai d'expiration de session (minutes)</Label>
                    <Select 
                      value={security.sessionTimeout.toString()} 
                      onValueChange={(value) => {
                        setSecurity({...security, sessionTimeout: parseInt(value)})
                        setHasChanges(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                        <SelectItem value="480">8 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passwordExpiry">Expiration du mot de passe (jours)</Label>
                    <Select 
                      value={security.passwordExpiry.toString()} 
                      onValueChange={(value) => {
                        setSecurity({...security, passwordExpiry: parseInt(value)})
                        setHasChanges(true)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 jours</SelectItem>
                        <SelectItem value="60">60 jours</SelectItem>
                        <SelectItem value="90">90 jours</SelectItem>
                        <SelectItem value="180">180 jours</SelectItem>
                        <SelectItem value="365">1 an</SelectItem>
                        <SelectItem value="0">Jamais</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Apparence */}
            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thème</CardTitle>
                  <CardDescription>
                    Personnalisez l'apparence de l'interface
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Thème de l'interface</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          appearance.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setAppearance({...appearance, theme: 'light'})
                          setHasChanges(true)
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Sun className="h-4 w-4" />
                          <span className="font-medium">Clair</span>
                        </div>
                        <div className="w-full h-8 bg-white border rounded flex">
                          <div className="w-1/3 bg-gray-100 rounded-l"></div>
                          <div className="w-2/3 bg-white rounded-r"></div>
                        </div>
                      </div>
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          appearance.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setAppearance({...appearance, theme: 'dark'})
                          setHasChanges(true)
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Moon className="h-4 w-4" />
                          <span className="font-medium">Sombre</span>
                        </div>
                        <div className="w-full h-8 bg-gray-800 border rounded flex">
                          <div className="w-1/3 bg-gray-700 rounded-l"></div>
                          <div className="w-2/3 bg-gray-800 rounded-r"></div>
                        </div>
                      </div>
                      <div 
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          appearance.theme === 'system' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                        }`}
                        onClick={() => {
                          setAppearance({...appearance, theme: 'system'})
                          setHasChanges(true)
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Monitor className="h-4 w-4" />
                          <span className="font-medium">Système</span>
                        </div>
                        <div className="w-full h-8 border rounded flex">
                          <div className="w-1/2 bg-gray-100 rounded-l"></div>
                          <div className="w-1/2 bg-gray-800 rounded-r"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Localisation et formats</CardTitle>
                  <CardDescription>
                    Configurez la langue, le fuseau horaire et les formats
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="language">Langue</Label>
                      <Select value={appearance.language} onValueChange={(value) => {
                        setAppearance({...appearance, language: value})
                        setHasChanges(true)
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="de">Deutsch</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuseau horaire</Label>
                      <Select value={appearance.timezone} onValueChange={(value) => {
                        setAppearance({...appearance, timezone: value})
                        setHasChanges(true)
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Europe/Paris">Europe/Paris (UTC+1)</SelectItem>
                          <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                          <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                          <SelectItem value="Asia/Tokyo">Asia/Tokyo (UTC+9)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateFormat">Format de date</Label>
                      <Select value={appearance.dateFormat} onValueChange={(value) => {
                        setAppearance({...appearance, dateFormat: value})
                        setHasChanges(true)
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                          <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                          <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                          <SelectItem value="DD-MM-YYYY">DD-MM-YYYY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="currency">Devise</Label>
                      <Select value={appearance.currency} onValueChange={(value) => {
                        setAppearance({...appearance, currency: value})
                        setHasChanges(true)
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">Euro (€)</SelectItem>
                          <SelectItem value="USD">Dollar US ($)</SelectItem>
                          <SelectItem value="GBP">Livre Sterling (£)</SelectItem>
                          <SelectItem value="CHF">Franc Suisse (CHF)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Business */}
            <TabsContent value="business" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Paramètres commerciaux</CardTitle>
                  <CardDescription>
                    Configurez vos paramètres d'activité commerciale
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="commissionRate">Taux de commission (%)</Label>
                      <Input
                        id="commissionRate"
                        type="number"
                        step="0.1"
                        min="0"
                        max="100"
                        value={business.commissionRate}
                        onChange={(e) => {
                          setBusiness({...business, commissionRate: parseFloat(e.target.value)})
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="defaultPropertyType">Type de propriété par défaut</Label>
                      <Select value={business.defaultPropertyType} onValueChange={(value) => {
                        setBusiness({...business, defaultPropertyType: value})
                        setHasChanges(true)
                      }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bureau">Bureau</SelectItem>
                          <SelectItem value="entrepot">Entrepôt</SelectItem>
                          <SelectItem value="commerce">Commerce</SelectItem>
                          <SelectItem value="terrain">Terrain</SelectItem>
                          <SelectItem value="industriel">Industriel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responseTime">Temps de réponse cible (heures)</Label>
                    <Select value={business.responseTime.toString()} onValueChange={(value) => {
                      setBusiness({...business, responseTime: parseInt(value)})
                      setHasChanges(true)
                    }}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 heure</SelectItem>
                        <SelectItem value="2">2 heures</SelectItem>
                        <SelectItem value="4">4 heures</SelectItem>
                        <SelectItem value="8">8 heures</SelectItem>
                        <SelectItem value="24">24 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Attribution automatique des prospects</div>
                      <div className="text-sm text-gray-500">Assigner automatiquement les nouveaux prospects</div>
                    </div>
                    <Switch
                      checked={business.autoAssignLeads}
                      onCheckedChange={(checked) => {
                        setBusiness({...business, autoAssignLeads: checked})
                        setHasChanges(true)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Horaires de travail</CardTitle>
                  <CardDescription>
                    Définissez vos horaires de disponibilité
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="workStart">Heure de début</Label>
                      <Input
                        id="workStart"
                        type="time"
                        value={business.workingHours.start}
                        onChange={(e) => {
                          setBusiness({
                            ...business, 
                            workingHours: {...business.workingHours, start: e.target.value}
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="workEnd">Heure de fin</Label>
                      <Input
                        id="workEnd"
                        type="time"
                        value={business.workingHours.end}
                        onChange={(e) => {
                          setBusiness({
                            ...business, 
                            workingHours: {...business.workingHours, end: e.target.value}
                          })
                          setHasChanges(true)
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Jours de travail</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={day}
                            aria-label={`Travailler le ${day}`}
                            checked={business.workingHours.days.includes(day)}
                            onChange={(e) => {
                              const days = e.target.checked
                                ? [...business.workingHours.days, day]
                                : business.workingHours.days.filter(d => d !== day)
                              setBusiness({
                                ...business,
                                workingHours: {...business.workingHours, days}
                              })
                              setHasChanges(true)
                            }}
                            className="rounded border-gray-300"
                          />
                          <Label htmlFor={day} className="text-sm capitalize">{day}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Signature email</CardTitle>
                  <CardDescription>
                    Personnalisez votre signature pour les emails automatiques
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="signature">Signature</Label>
                    <Textarea
                      id="signature"
                      value={business.signature}
                      onChange={(e) => {
                        setBusiness({...business, signature: e.target.value})
                        setHasChanges(true)
                      }}
                      rows={6}
                      placeholder="Votre signature email..."
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Section de gestion des données */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Gestion des données
              </CardTitle>
              <CardDescription>
                Exportez ou supprimez vos données
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" onClick={handleExportData}>
                  <Download className="h-4 w-4 mr-2" />
                  Exporter mes données
                </Button>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action ne peut pas être annulée. Cela supprimera définitivement votre compte
                        et toutes vos données de nos serveurs.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-600 hover:bg-red-700">
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </RoleGuard>
  )
}