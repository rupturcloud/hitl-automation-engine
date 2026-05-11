"use client";

/**
 * NotificationButton Component
 * Integrado com useWebPush hook para ativar/testar Web Push notifications
 *
 * Uso:
 * import { NotificationButton } from "@/components/NotificationButton";
 *
 * export default function Header() {
 *   const { data: session } = useSession();
 *   return (
 *     <nav>
 *       <NotificationButton token={session?.user?.token} />
 *     </nav>
 *   );
 * }
 */

import React, { useState, useEffect } from "react";
import { useWebPush } from "../hooks/useWebPush";
import { Bell, Check, AlertCircle, Loader } from "lucide-react";

interface NotificationButtonProps {
  token?: string;
  className?: string;
}

export function NotificationButton({ token, className = "" }: NotificationButtonProps) {
  const [mounted, setMounted] = useState(false);
  const { isSupported, isSubscribed, isPending, error, subscribe, sendTest } =
    useWebPush(token);

  // Hydration fix
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (!isSupported) {
    return null; // Web Push não suportado neste navegador
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={isSubscribed ? sendTest : subscribe}
        disabled={isPending}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg font-medium
          transition-all duration-200
          ${
            isPending
              ? "opacity-50 cursor-not-allowed"
              : isSubscribed
                ? "bg-green-100 text-green-700 hover:bg-green-200"
                : "bg-blue-100 text-blue-700 hover:bg-blue-200"
          }
        `}
        title={isSubscribed ? "Clique para testar notificações" : "Ativar notificações push"}
      >
        {isPending ? (
          <>
            <Loader size={16} className="animate-spin" />
            <span className="text-sm">Carregando...</span>
          </>
        ) : isSubscribed ? (
          <>
            <Check size={16} />
            <span className="text-sm">Notificações ativas</span>
          </>
        ) : (
          <>
            <Bell size={16} />
            <span className="text-sm">Ativar notificações</span>
          </>
        )}
      </button>

      {error && (
        <div className="flex items-center gap-1 text-red-600 text-xs">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {/* Tooltip de sucesso */}
      {isSubscribed && !error && (
        <div className="text-xs text-gray-500">
          📬 Push notifications ativadas
        </div>
      )}
    </div>
  );
}

export default NotificationButton;
