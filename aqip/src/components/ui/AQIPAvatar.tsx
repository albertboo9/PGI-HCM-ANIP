import clsx from 'clsx';

interface AQIPAvatarProps {
  src?: string;
  alt?: string;
  initials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export default function AQIPAvatar({
  src,
  alt = '',
  initials,
  size = 'md',
  status,
  className
}: AQIPAvatarProps) {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-16 w-16 text-xl'
  };

  const statusColors = {
    online: 'bg-aqip-accent',
    offline: 'bg-aqip-text-muted',
    busy: 'bg-aqip-danger',
    away: 'bg-aqip-warning'
  };

  const statusSizes = {
    sm: 'h-2 w-2 ring-1',
    md: 'h-2.5 w-2.5 ring-2',
    lg: 'h-3 w-3 ring-2',
    xl: 'h-4 w-4 ring-2'
  };

  return (
    <div className={clsx('relative inline-block', className)}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={clsx('rounded-full object-cover bg-aqip-bg-elevated border border-aqip-border', sizes[size])}
        />
      ) : (
        <div className={clsx(
          'flex items-center justify-center rounded-full bg-aqip-primary/10 text-aqip-primary font-bold border border-aqip-primary/20',
          sizes[size]
        )}>
          {initials || '?'}
        </div>
      )}
      
      {status && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 block rounded-full ring-aqip-bg-surface',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  );
}
