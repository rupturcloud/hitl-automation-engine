import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, EmptyState, Button } from '../../ds/index.js';

export default function Placeholder({ name }) {
  const params = useParams();
  const navigate = useNavigate();
  const label = name || params.screen || 'Tela';
  return (
    <>
      <PageHeader
        crumbs={['Ruptur OS', label]}
        title={label.charAt(0).toUpperCase() + label.slice(1)}
        sub="Em portagem — design pronto, JSX em construção"
      />
      <EmptyState
        icon="sparkles"
        title={`${label} — aguardando portagem`}
        text="Esta tela faz parte do handoff Ruptur SaaS — WhatsApp Sales OS. Ainda não foi recriada em React moderno; volte ao Cockpit ou siga a Landing enquanto isso."
        action={<Button variant="primary" icon="arrowRight" onClick={() => navigate('/v0/dashboard')}>Ir pro Cockpit</Button>}
      />
    </>
  );
}
