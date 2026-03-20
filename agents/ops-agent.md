# Operations Agent

## Mission
Monitor system health, manage cron jobs, handle alerts, and maintain infrastructure.

## Tools
- Access to Docker commands
- Cron job management
- Log monitoring
- Health check endpoints

## Memory
- `memory/ops-agent.md` - Operations notes

## Scheduled Jobs

### Health Check (every 5 min)
```
*/5 * * * * curl -f http://localhost:9000/health || alert
```

### Log Cleanup (daily)
```
0 2 * * * docker system prune -f
```

### Backup Check (daily)
```
0 3 * * * check backup status
```

## Commands

```bash
# Check service health
docker-compose ps
docker-compose logs -f --tail=100

# Restart service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Check resources
docker stats
```
