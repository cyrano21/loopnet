"use client"

import { ReactNode } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { RoleGuard } from "@/components/role-guard"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Building2,
  BarChart3,
  Users,
  MessageSquare,
  Calendar,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  DollarSign,
  Home,
  PlusCircle,
  Target,
  Briefcase,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"

export default function AgentDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const pathname = usePathname()
  const { user } = useAuth()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <RoleGuard allowedRoles={["agent", "admin"]}>
      <SidebarProvider>
        <div className="flex min-h-screen pt-16">
          <Sidebar>
            <SidebarHeader className="py-4">
              <div className="flex items-center gap-2 px-2">
                <Link href="/" className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-blue-600" />
                  <span className="text-lg font-bold">LoopNet Agent</span>
                </Link>
                <div className="flex-1" />
                <SidebarTrigger />
              </div>
            </SidebarHeader>

            <SidebarContent>
              {/* Navigation principale */}
              <SidebarGroup>
                <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/agent-dashboard" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard")}
                          tooltip="Tableau de bord"
                        >
                          <Home className="h-4 w-4" />
                          <span>Tableau de bord</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/properties" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/properties")}
                          tooltip="Mes propriétés"
                        >
                          <Building2 className="h-4 w-4" />
                          <span>Mes propriétés</span>
                          <SidebarMenuBadge>12</SidebarMenuBadge>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/leads" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/leads")}
                          tooltip="Leads"
                        >
                          <Users className="h-4 w-4" />
                          <span>Leads</span>
                          <SidebarMenuBadge>5</SidebarMenuBadge>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/messages" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/messages")}
                          tooltip="Messages"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>Messages</span>
                          <SidebarMenuBadge>3</SidebarMenuBadge>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/calendar" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/calendar")}
                          tooltip="Calendrier"
                        >
                          <Calendar className="h-4 w-4" />
                          <span>Calendrier</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Analyse et rapports */}
              <SidebarGroup>
                <SidebarGroupLabel>Analyse & Rapports</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/analytics" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/analytics")}
                          tooltip="Statistiques"
                        >
                          <BarChart3 className="h-4 w-4" />
                          <span>Statistiques</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/commissions" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/commissions")}
                          tooltip="Commissions"
                        >
                          <DollarSign className="h-4 w-4" />
                          <span>Commissions</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/goals" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/goals")}
                          tooltip="Objectifs"
                        >
                          <Target className="h-4 w-4" />
                          <span>Objectifs</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/reports" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/reports")}
                          tooltip="Rapports"
                        >
                          <FileText className="h-4 w-4" />
                          <span>Rapports</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Outils */}
              <SidebarGroup>
                <SidebarGroupLabel>Outils</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/marketing" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/marketing")}
                          tooltip="Marketing"
                        >
                          <Briefcase className="h-4 w-4" />
                          <span>Marketing</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/settings" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/settings")}
                          tooltip="Paramètres"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Paramètres</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                      <Link href="/agent-dashboard/help" passHref legacyBehavior>
                        <SidebarMenuButton
                          isActive={isActive("/agent-dashboard/help")}
                          tooltip="Aide"
                        >
                          <HelpCircle className="h-4 w-4" />
                          <span>Aide</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
              <div className="flex flex-col gap-2 px-2">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <PlusCircle className="h-4 w-4" />
                  <span>Ajouter une propriété</span>
                </Button>

                <div className="flex items-center gap-2 rounded-md border p-2">
                  <Avatar>
                    <AvatarImage src={user?.image || undefined} alt={user?.name || "Agent"} />
                    <AvatarFallback>{user?.name?.[0] || "A"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">{user?.name || "Agent"}</p>
                    <p className="truncate text-xs text-muted-foreground">{user?.email || "agent@example.com"}</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Agent
                  </Badge>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <div className="flex h-14 items-center gap-4 border-b px-4 lg:h-[60px] lg:px-6">
              <div className="flex flex-1 items-center gap-4">
                <h1 className="text-lg font-semibold">Dashboard Agent</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Bell className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-4 lg:p-6">{children}</div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </RoleGuard>
  )
}