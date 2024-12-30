start:
	@echo "Running node-rewards-manager"
	@docker compose -f docker-compose.yml up -d --no-deps --build

stop:
	@echo "Stopping node-rewards-manager"
	@docker compose -f docker-compose.yml down
