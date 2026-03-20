# DropshipPro - Security Notes

## Network Security

### Firewall Rules
```bash
# Allow only necessary ports
ufw allow 22    # SSH
ufw allow 80     # HTTP
ufw allow 443    # HTTPS
ufw deny all     # Block everything else
```

### Internal Network
- Frontend → Backend: Allowed
- Backend → Database: Allowed (internal)
- OpenClaw → Backend: Allowed (internal)
- External → Database: DENY

## API Security

### Authentication
- All internal routes require JWT
- API keys for supplier integrations
- Rate limiting on public endpoints

### Webhooks
- Verify webhook signatures (Stripe, CJ)
- Log all webhook events

## Secrets Management

### Environment Variables
- Never commit secrets to git
- Use Docker secrets for production
- Rotate API keys quarterly

### Database
- Use strong passwords
- Enable SSL connections
- Regular backups

## Application Security

### Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Content-Security-Policy "...";
```

### Dependencies
- Audit npm packages regularly
- Update dependencies monthly
- Use Dependabot

## Monitoring

### Alert Thresholds
- CPU > 80% for 5 min
- Memory > 85%
- Error rate > 5%
- Response time > 2s

## Incident Response

1. Identify issue
2. Contain (isolate affected service)
3. Eradicate (fix root cause)
4. Recover (restore service)
5. Document (post-mortem)

## Compliance
- PCI-DSS for payments (use Stripe)
- GDPR for EU customers
- Data retention policy
