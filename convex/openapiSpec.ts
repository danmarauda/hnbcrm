// OpenAPI 3.1.0 specification for the ClawCRM REST API
// Served at /api/v1/openapi.json

export const OPENAPI_SPEC = `{
  "openapi": "3.1.0",
  "info": {
    "title": "ClawCRM API",
    "description": "ClawCRM REST API — multi-tenant CRM with collaboration between humans and AI agents. All endpoints require authentication via the X-API-Key header.",
    "version": "1.0.0",
    "contact": {
      "name": "ClawCRM"
    }
  },
  "servers": [
    {
      "url": "/",
      "description": "Servidor atual"
    }
  ],
  "security": [
    {
      "ApiKeyAuth": []
    }
  ],
  "tags": [
    { "name": "Leads", "description": "Lead management in the sales pipeline" },
    { "name": "Contacts", "description": "Contact management and data enrichment" },
    { "name": "Conversations", "description": "Multichannel conversations and messages" },
    { "name": "Handoffs", "description": "Transfers between AI agents and humans" },
    { "name": "Reference", "description": "Reference data: boards, members, and fields" },
    { "name": "Activities", "description": "Lead activity timeline" },
    { "name": "Dashboard", "description": "Dashboard statistics and metrics" },
    { "name": "Tasks", "description": "Task and reminder management for the CRM" },
    { "name": "Sources", "description": "Lead acquisition sources" },
    { "name": "Audit", "description": "Audit logs" },
    { "name": "Calendar", "description": "Calendar events" }
  ],
  "paths": {
    "/api/v1/inbound/lead": {
      "post": {
        "tags": ["Leads"],
        "summary": "Create lead via universal capture",
        "description": "Creates a new lead with optional contact and message. If the contact does not exist, it is created automatically. If a message is provided, a conversation is created.",
        "operationId": "createInboundLead",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["title"],
                "properties": {
                  "title": { "type": "string", "description": "Lead title" },
                  "contact": {
                    "type": "object",
                    "description": "Associated contact data",
                    "properties": {
                      "email": { "type": "string", "format": "email", "description": "Contact email" },
                      "phone": { "type": "string", "description": "Contact phone" },
                      "firstName": { "type": "string", "description": "Primeiro nome" },
                      "lastName": { "type": "string", "description": "Sobrenome" },
                      "company": { "type": "string", "description": "Empresa" }
                    }
                  },
                  "message": { "type": "string", "description": "Initial message (creates a conversation)" },
                  "channel": { "type": "string", "enum": ["whatsapp", "telegram", "email", "webchat", "internal"], "default": "webchat", "description": "Conversation channel" },
                  "value": { "type": "number", "default": 0, "description": "Lead monetary value" },
                  "currency": { "type": "string", "description": "Currency code (e.g. BRL)" },
                  "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"], "default": "medium", "description": "Lead priority" },
                  "temperature": { "type": "string", "enum": ["cold", "warm", "hot"], "default": "cold", "description": "Lead temperature" },
                  "sourceId": { "type": "string", "description": "Lead source ID" },
                  "tags": { "type": "array", "items": { "type": "string" }, "description": "Categorization tags" },
                  "customFields": { "type": "object", "additionalProperties": true, "description": "Campos personalizados" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Lead created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "leadId": { "type": "string", "description": "ID of created lead" },
                    "contactId": { "type": "string", "description": "Associated contact ID" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads": {
      "get": {
        "tags": ["Leads"],
        "summary": "List leads",
        "description": "Returns a list of organization leads with optional filters.",
        "operationId": "listLeads",
        "parameters": [
          { "name": "boardId", "in": "query", "schema": { "type": "string" }, "description": "Filter by board (pipeline)" },
          { "name": "stageId", "in": "query", "schema": { "type": "string" }, "description": "Filter by stage" },
          { "name": "assignedTo", "in": "query", "schema": { "type": "string" }, "description": "Filter by responsible member" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 200, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor (retornado como nextCursor na resposta anterior)" }
        ],
        "responses": {
          "200": {
            "description": "List of leads",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "leads": { "type": "array", "items": { "$ref": "#/components/schemas/Lead" } },
                    "nextCursor": { "type": "string", "nullable": true, "description": "Cursor for the next page (null if there are no more)" },
                    "hasMore": { "type": "boolean", "description": "Indicates whether there are more results" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads/get": {
      "get": {
        "tags": ["Leads"],
        "summary": "Get lead",
        "description": "Returns data for a specific lead by ID.",
        "operationId": "getLead",
        "parameters": [
          { "name": "id", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Lead ID" }
        ],
        "responses": {
          "200": {
            "description": "Lead data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "lead": { "$ref": "#/components/schemas/Lead" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "404": { "$ref": "#/components/responses/NotFound" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads/update": {
      "post": {
        "tags": ["Leads"],
        "summary": "Update lead",
        "description": "Updates fields of an existing lead.",
        "operationId": "updateLead",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leadId"],
                "properties": {
                  "leadId": { "type": "string", "description": "Lead ID" },
                  "title": { "type": "string", "description": "New title" },
                  "value": { "type": "number", "description": "New monetary value" },
                  "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"], "description": "New priority" },
                  "temperature": { "type": "string", "enum": ["cold", "warm", "hot"], "description": "New temperature" },
                  "tags": { "type": "array", "items": { "type": "string" }, "description": "Novas tags" },
                  "customFields": { "type": "object", "additionalProperties": true, "description": "Campos personalizados" },
                  "sourceId": { "type": "string", "description": "Lead source ID" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads/delete": {
      "post": {
        "tags": ["Leads"],
        "summary": "Delete lead",
        "description": "Permanently removes a lead.",
        "operationId": "deleteLead",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leadId"],
                "properties": {
                  "leadId": { "type": "string", "description": "Lead ID to delete" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads/move-stage": {
      "post": {
        "tags": ["Leads"],
        "summary": "Move lead stage",
        "description": "Moves a lead to a different stage in the pipeline.",
        "operationId": "moveLeadStage",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leadId", "stageId"],
                "properties": {
                  "leadId": { "type": "string", "description": "Lead ID" },
                  "stageId": { "type": "string", "description": "Destination stage ID" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads/assign": {
      "post": {
        "tags": ["Leads"],
        "summary": "Assign lead",
        "description": "Assigns or unassigns a lead to a team member. Omit assignedTo to unassign.",
        "operationId": "assignLead",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leadId"],
                "properties": {
                  "leadId": { "type": "string", "description": "Lead ID" },
                  "assignedTo": { "type": "string", "description": "Team member ID (omit to unassign)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/leads/handoff": {
      "post": {
        "tags": ["Leads", "Handoffs"],
        "summary": "Request handoff",
        "description": "Requests a lead handoff to another team member.",
        "operationId": "requestHandoff",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leadId", "reason"],
                "properties": {
                  "leadId": { "type": "string", "description": "Lead ID" },
                  "reason": { "type": "string", "description": "Reason for handoff" },
                  "toMemberId": { "type": "string", "description": "Target member ID (optional, any human if omitted)" },
                  "summary": { "type": "string", "description": "Conversation summary" },
                  "suggestedActions": { "type": "array", "items": { "type": "string" }, "description": "Suggested actions" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Handoff created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "handoffId": { "type": "string", "description": "ID of created handoff" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts": {
      "get": {
        "tags": ["Contacts"],
        "summary": "List contacts",
        "description": "Returns a list of organization contacts.",
        "operationId": "listContacts",
        "parameters": [
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 500, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "List of contacts",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contacts": { "type": "array", "items": { "$ref": "#/components/schemas/Contact" } },
                    "nextCursor": { "type": "string", "nullable": true, "description": "Cursor for the next page" },
                    "hasMore": { "type": "boolean", "description": "Indicates whether there are more results" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts/create": {
      "post": {
        "tags": ["Contacts"],
        "summary": "Create contact",
        "description": "Creates a new contact in the organization.",
        "operationId": "createContact",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "firstName": { "type": "string", "description": "Primeiro nome" },
                  "lastName": { "type": "string", "description": "Sobrenome" },
                  "email": { "type": "string", "format": "email", "description": "Email" },
                  "phone": { "type": "string", "description": "Phone" },
                  "company": { "type": "string", "description": "Empresa" },
                  "title": { "type": "string", "description": "Job title" },
                  "whatsappNumber": { "type": "string", "description": "WhatsApp number" },
                  "telegramUsername": { "type": "string", "description": "Telegram username" },
                  "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags" },
                  "photoUrl": { "type": "string", "format": "uri", "description": "Photo URL" },
                  "bio": { "type": "string", "description": "Biografia" },
                  "linkedinUrl": { "type": "string", "format": "uri", "description": "LinkedIn URL" },
                  "instagramUrl": { "type": "string", "format": "uri", "description": "Instagram URL" },
                  "facebookUrl": { "type": "string", "format": "uri", "description": "Facebook URL" },
                  "twitterUrl": { "type": "string", "format": "uri", "description": "Twitter/X URL" },
                  "city": { "type": "string", "description": "City" },
                  "state": { "type": "string", "description": "State" },
                  "country": { "type": "string", "description": "Country" },
                  "industry": { "type": "string", "description": "Industry" },
                  "companySize": { "type": "string", "description": "Company size" },
                  "cnpj": { "type": "string", "description": "Company tax ID (CNPJ)" },
                  "companyWebsite": { "type": "string", "format": "uri", "description": "Company website" },
                  "preferredContactTime": { "type": "string", "enum": ["morning", "afternoon", "evening"], "description": "Preferred time for contact" },
                  "deviceType": { "type": "string", "enum": ["android", "iphone", "desktop", "unknown"], "description": "Device type" },
                  "utmSource": { "type": "string", "description": "UTM source" },
                  "acquisitionChannel": { "type": "string", "description": "Acquisition channel" },
                  "instagramFollowers": { "type": "number", "description": "Seguidores no Instagram" },
                  "linkedinConnections": { "type": "number", "description": "LinkedIn connections" },
                  "socialInfluenceScore": { "type": "number", "minimum": 0, "maximum": 100, "description": "Social influence score (0-100)" },
                  "customFields": { "type": "object", "additionalProperties": true, "description": "Campos personalizados" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Contact created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "contactId": { "type": "string", "description": "ID of created contact" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts/get": {
      "get": {
        "tags": ["Contacts"],
        "summary": "Get contact",
        "description": "Returns data for a specific contact by ID.",
        "operationId": "getContact",
        "parameters": [
          { "name": "id", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Contact ID" }
        ],
        "responses": {
          "200": {
            "description": "Contact data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contact": { "$ref": "#/components/schemas/Contact" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "404": { "$ref": "#/components/responses/NotFound" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts/update": {
      "post": {
        "tags": ["Contacts"],
        "summary": "Update contact",
        "description": "Updates fields of an existing contact.",
        "operationId": "updateContact",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["contactId"],
                "properties": {
                  "contactId": { "type": "string", "description": "Contact ID" },
                  "firstName": { "type": "string", "description": "Primeiro nome" },
                  "lastName": { "type": "string", "description": "Sobrenome" },
                  "email": { "type": "string", "format": "email", "description": "Email" },
                  "phone": { "type": "string", "description": "Phone" },
                  "company": { "type": "string", "description": "Empresa" },
                  "title": { "type": "string", "description": "Job title" },
                  "whatsappNumber": { "type": "string", "description": "WhatsApp number" },
                  "telegramUsername": { "type": "string", "description": "Telegram username" },
                  "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags" },
                  "photoUrl": { "type": "string", "format": "uri", "description": "Photo URL" },
                  "bio": { "type": "string", "description": "Biografia" },
                  "linkedinUrl": { "type": "string", "format": "uri", "description": "LinkedIn URL" },
                  "instagramUrl": { "type": "string", "format": "uri", "description": "Instagram URL" },
                  "facebookUrl": { "type": "string", "format": "uri", "description": "Facebook URL" },
                  "twitterUrl": { "type": "string", "format": "uri", "description": "Twitter/X URL" },
                  "city": { "type": "string", "description": "City" },
                  "state": { "type": "string", "description": "State" },
                  "country": { "type": "string", "description": "Country" },
                  "industry": { "type": "string", "description": "Industry" },
                  "companySize": { "type": "string", "description": "Company size" },
                  "cnpj": { "type": "string", "description": "Company tax ID (CNPJ)" },
                  "companyWebsite": { "type": "string", "format": "uri", "description": "Company website" },
                  "preferredContactTime": { "type": "string", "enum": ["morning", "afternoon", "evening"], "description": "Preferred time for contact" },
                  "deviceType": { "type": "string", "enum": ["android", "iphone", "desktop", "unknown"], "description": "Device type" },
                  "utmSource": { "type": "string", "description": "UTM source" },
                  "acquisitionChannel": { "type": "string", "description": "Acquisition channel" },
                  "instagramFollowers": { "type": "number", "description": "Seguidores no Instagram" },
                  "linkedinConnections": { "type": "number", "description": "LinkedIn connections" },
                  "socialInfluenceScore": { "type": "number", "minimum": 0, "maximum": 100, "description": "Social influence score (0-100)" },
                  "customFields": { "type": "object", "additionalProperties": true, "description": "Campos personalizados" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts/enrich": {
      "post": {
        "tags": ["Contacts"],
        "summary": "Enrich contact",
        "description": "Enriches a contact with data from an external source. Used by AI agents to add discovered information.",
        "operationId": "enrichContact",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["contactId", "fields", "source"],
                "properties": {
                  "contactId": { "type": "string", "description": "Contact ID" },
                  "fields": { "type": "object", "additionalProperties": true, "description": "Campos e valores a enriquecer" },
                  "source": { "type": "string", "description": "Data source name (e.g. linkedin, google)" },
                  "confidence": { "type": "number", "minimum": 0, "maximum": 1, "description": "Data confidence score (0-1)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts/gaps": {
      "get": {
        "tags": ["Contacts"],
        "summary": "Enrichment gaps",
        "description": "Identifies missing or enrichable fields in a contact.",
        "operationId": "getContactGaps",
        "parameters": [
          { "name": "id", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Contact ID" }
        ],
        "responses": {
          "200": {
            "description": "Contact gap data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contact": { "type": "object", "description": "Contact with gap information and enrichment metadata" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "404": { "$ref": "#/components/responses/NotFound" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/contacts/search": {
      "get": {
        "tags": ["Contacts"],
        "summary": "Search contacts",
        "description": "Busca contacts por texto (nome, email, empresa, etc).",
        "operationId": "searchContacts",
        "parameters": [
          { "name": "q", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Texto de busca" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 20, "maximum": 100 }, "description": "Limite de resultados" }
        ],
        "responses": {
          "200": {
            "description": "Contacts encontrados",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "contacts": { "type": "array", "items": { "$ref": "#/components/schemas/Contact" } }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/conversations": {
      "get": {
        "tags": ["Conversations"],
        "summary": "List conversations",
        "description": "Returns a list of organization conversations with an optional lead filter.",
        "operationId": "listConversations",
        "parameters": [
          { "name": "leadId", "in": "query", "schema": { "type": "string" }, "description": "Filter by lead" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 200, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "List of conversations",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "conversations": { "type": "array", "items": { "$ref": "#/components/schemas/Conversation" } },
                    "nextCursor": { "type": "string", "nullable": true, "description": "Cursor for the next page" },
                    "hasMore": { "type": "boolean", "description": "Indicates whether there are more results" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/conversations/messages": {
      "get": {
        "tags": ["Conversations"],
        "summary": "List messages",
        "description": "Return all messages from a conversation.",
        "operationId": "getMessages",
        "parameters": [
          { "name": "conversationId", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Conversation ID" }
        ],
        "responses": {
          "200": {
            "description": "List of messages",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "messages": { "type": "array", "items": { "$ref": "#/components/schemas/Message" } }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/conversations/send": {
      "post": {
        "tags": ["Conversations"],
        "summary": "Send message",
        "description": "Sends a message in an existing conversation.",
        "operationId": "sendMessage",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["conversationId", "content"],
                "properties": {
                  "conversationId": { "type": "string", "description": "Conversation ID" },
                  "content": { "type": "string", "description": "Message content" },
                  "contentType": { "type": "string", "enum": ["text", "image", "file", "audio"], "default": "text", "description": "Content type" },
                  "isInternal": { "type": "boolean", "default": false, "description": "Internal note (not visible to contact)" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Message sent successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "messageId": { "type": "string", "description": "ID of created message" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/handoffs": {
      "get": {
        "tags": ["Handoffs"],
        "summary": "List handoffs",
        "description": "Returns a list of organization handoffs with an optional status filter.",
        "operationId": "listHandoffs",
        "parameters": [
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["pending", "accepted", "rejected"] }, "description": "Filter by status" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 200, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "List of handoffs",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "handoffs": { "type": "array", "items": { "$ref": "#/components/schemas/Handoff" } },
                    "nextCursor": { "type": "string", "nullable": true, "description": "Cursor for the next page" },
                    "hasMore": { "type": "boolean", "description": "Indicates whether there are more results" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/handoffs/pending": {
      "get": {
        "tags": ["Handoffs"],
        "summary": "List pending handoffs",
        "description": "Shortcut to list only pending handoffs.",
        "operationId": "listPendingHandoffs",
        "responses": {
          "200": {
            "description": "List of pending handoffs",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "handoffs": { "type": "array", "items": { "$ref": "#/components/schemas/Handoff" } }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/handoffs/accept": {
      "post": {
        "tags": ["Handoffs"],
        "summary": "Accept handoff",
        "description": "Accepts a pending handoff request.",
        "operationId": "acceptHandoff",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["handoffId"],
                "properties": {
                  "handoffId": { "type": "string", "description": "Handoff ID" },
                  "notes": { "type": "string", "description": "Notes adicionais" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/handoffs/reject": {
      "post": {
        "tags": ["Handoffs"],
        "summary": "Reject handoff",
        "description": "Rejects a pending handoff request.",
        "operationId": "rejectHandoff",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["handoffId"],
                "properties": {
                  "handoffId": { "type": "string", "description": "Handoff ID" },
                  "notes": { "type": "string", "description": "Notes adicionais" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/boards": {
      "get": {
        "tags": ["Reference"],
        "summary": "List boards with stages",
        "description": "Returns all organization boards (pipelines) with their stages.",
        "operationId": "listBoards",
        "responses": {
          "200": {
            "description": "List of boards with stages",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "boards": {
                      "type": "array",
                      "items": {
                        "allOf": [
                          { "$ref": "#/components/schemas/Board" },
                          {
                            "type": "object",
                            "properties": {
                              "stages": { "type": "array", "items": { "$ref": "#/components/schemas/Stage" } }
                            }
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/team-members": {
      "get": {
        "tags": ["Reference"],
        "summary": "List team members",
        "description": "Returns all team members (humans and AI agents). Each member includes an optional field 'permissions' com 9 RBAC categories. Management operations (invite, edit, removal) are Convex mutations e are not available via REST.",
        "operationId": "listTeamMembers",
        "responses": {
          "200": {
            "description": "List of members",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "members": { "type": "array", "items": { "$ref": "#/components/schemas/TeamMember" } }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/field-definitions": {
      "get": {
        "tags": ["Reference"],
        "summary": "List field definitions",
        "description": "Returns custom field definitions for the organization.",
        "operationId": "listFieldDefinitions",
        "responses": {
          "200": {
            "description": "List of field definitions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "fields": { "type": "array", "items": { "$ref": "#/components/schemas/FieldDefinition" } }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/activities": {
      "get": {
        "tags": ["Activities"],
        "summary": "List activities",
        "description": "Returns activities for a specific lead.",
        "operationId": "listActivities",
        "parameters": [
          { "name": "leadId", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Lead ID" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 50, "maximum": 200 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "Activity list",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "activities": { "type": "array", "items": { "$ref": "#/components/schemas/Activity" } },
                    "nextCursor": { "type": "string", "nullable": true, "description": "Cursor for the next page" },
                    "hasMore": { "type": "boolean", "description": "Indicates whether there are more results" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      },
      "post": {
        "tags": ["Activities"],
        "summary": "Create atividade",
        "description": "Logs a new activity on a lead.",
        "operationId": "createActivity",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["leadId", "type"],
                "properties": {
                  "leadId": { "type": "string", "description": "Lead ID" },
                  "type": { "type": "string", "enum": ["note", "call", "email", "meeting", "task"], "description": "Activity type" },
                  "content": { "type": "string", "description": "Activity content or description" },
                  "metadata": { "type": "object", "additionalProperties": true, "description": "Metadados adicionais" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Activity created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "activityId": { "type": "string", "description": "ID of created activity" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/dashboard": {
      "get": {
        "tags": ["Dashboard"],
        "summary": "Get dashboard statistics",
        "description": "Returns aggregated organization metrics: total leads, leads this month, conversion rate, total value, and leads by stage.",
        "operationId": "getDashboardStats",
        "responses": {
          "200": {
            "description": "Dashboard statistics",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "totalLeads": { "type": "integer", "description": "Total leads" },
                    "leadsThisMonth": { "type": "integer", "description": "Leads created this month" },
                    "conversionRate": { "type": "number", "description": "Conversion rate (0-1)" },
                    "totalValue": { "type": "number", "description": "Total pipeline value" },
                    "leadsByStage": { "type": "object", "additionalProperties": { "type": "integer" }, "description": "Lead count by stage (key: stage name)" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/lead-sources": {
      "get": {
        "tags": ["Sources"],
        "summary": "List lead sources",
        "description": "Returns all organization lead sources.",
        "operationId": "listLeadSources",
        "responses": {
          "200": {
            "description": "Source list",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sources": { "type": "array", "items": { "$ref": "#/components/schemas/LeadSource" } }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks": {
      "get": {
        "tags": ["Tasks"],
        "summary": "List tasks",
        "description": "Returns tasks for the organization with optional filters.",
        "operationId": "listTasks",
        "parameters": [
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["pending", "in_progress", "completed", "cancelled"] }, "description": "Filter by status" },
          { "name": "priority", "in": "query", "schema": { "type": "string", "enum": ["low", "medium", "high", "urgent"] }, "description": "Filter by priority" },
          { "name": "assignedTo", "in": "query", "schema": { "type": "string" }, "description": "Filter by owner" },
          { "name": "leadId", "in": "query", "schema": { "type": "string" }, "description": "Filter by lead" },
          { "name": "contactId", "in": "query", "schema": { "type": "string" }, "description": "Filter by contact" },
          { "name": "type", "in": "query", "schema": { "type": "string", "enum": ["task", "reminder"] }, "description": "Filter by type" },
          { "name": "activityType", "in": "query", "schema": { "type": "string", "enum": ["todo", "call", "email", "follow_up", "meeting", "research"] }, "description": "Filter by activity type" },
          { "name": "dueBefore", "in": "query", "schema": { "type": "number" }, "description": "Due before (timestamp ms)" },
          { "name": "dueAfter", "in": "query", "schema": { "type": "number" }, "description": "Due date after (timestamp ms)" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 200, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "List of tasks",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "tasks": { "type": "array", "items": { "$ref": "#/components/schemas/Task" } },
                    "nextCursor": { "type": "string", "nullable": true },
                    "hasMore": { "type": "boolean" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/get": {
      "get": {
        "tags": ["Tasks"],
        "summary": "Get task",
        "description": "Returns data for a specific task by ID.",
        "operationId": "getTask",
        "parameters": [
          { "name": "id", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Task ID" }
        ],
        "responses": {
          "200": {
            "description": "Task data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "task": { "$ref": "#/components/schemas/Task" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "404": { "$ref": "#/components/responses/NotFound" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/my": {
      "get": {
        "tags": ["Tasks"],
        "summary": "My tasks",
        "description": "Returns pending and in-progress tasks for the authenticated agent.",
        "operationId": "getMyTasks",
        "responses": {
          "200": {
            "description": "Agent tasks",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "tasks": { "type": "array", "items": { "$ref": "#/components/schemas/Task" } }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/overdue": {
      "get": {
        "tags": ["Tasks"],
        "summary": "Overdue tasks",
        "description": "Lists tasks with past due dates and status pending or in progress.",
        "operationId": "getOverdueTasks",
        "parameters": [
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 200, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "Overdue tasks",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "tasks": { "type": "array", "items": { "$ref": "#/components/schemas/Task" } },
                    "nextCursor": { "type": "string", "nullable": true },
                    "hasMore": { "type": "boolean" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/search": {
      "get": {
        "tags": ["Tasks"],
        "summary": "Search tasks",
        "description": "Searches tasks by text (title, description).",
        "operationId": "searchTasks",
        "parameters": [
          { "name": "q", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Texto de busca" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 50, "maximum": 100 }, "description": "Limite de resultados" }
        ],
        "responses": {
          "200": {
            "description": "Tasks encontradas",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "tasks": { "type": "array", "items": { "$ref": "#/components/schemas/Task" } }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/create": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Create task",
        "description": "Creates a new task or reminder.",
        "operationId": "createTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["title"],
                "properties": {
                  "title": { "type": "string", "description": "Task title" },
                  "type": { "type": "string", "enum": ["task", "reminder"], "default": "task", "description": "Type" },
                  "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"], "default": "medium", "description": "Prioridade" },
                  "activityType": { "type": "string", "enum": ["todo", "call", "email", "follow_up", "meeting", "research"], "description": "CRM activity type" },
                  "description": { "type": "string", "description": "Description detalhada" },
                  "dueDate": { "type": "number", "description": "Due date (timestamp ms)" },
                  "leadId": { "type": "string", "description": "Associated lead ID" },
                  "contactId": { "type": "string", "description": "Associated contact ID" },
                  "assignedTo": { "type": "string", "description": "Responsible member ID" },
                  "recurrence": {
                    "type": "object",
                    "properties": {
                      "pattern": { "type": "string", "enum": ["daily", "weekly", "biweekly", "monthly"], "description": "Recurrence default" },
                      "endDate": { "type": "number", "description": "Recurrence end date (timestamp ms)" }
                    }
                  },
                  "checklist": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" }, "completed": { "type": "boolean" } } }, "description": "Checklist items" },
                  "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Task created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "taskId": { "type": "string", "description": "ID of created task" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/update": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Update task",
        "description": "Updates fields of an existing task.",
        "operationId": "updateTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskId"],
                "properties": {
                  "taskId": { "type": "string", "description": "Task ID" },
                  "title": { "type": "string", "description": "New title" },
                  "description": { "type": "string", "description": "New description" },
                  "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"], "description": "New priority" },
                  "activityType": { "type": "string", "enum": ["todo", "call", "email", "follow_up", "meeting", "research"], "description": "New activity type" },
                  "dueDate": { "type": "number", "description": "New due date (timestamp ms)" },
                  "tags": { "type": "array", "items": { "type": "string" }, "description": "Novas tags" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/complete": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Complete task",
        "description": "Marks a task as completed.",
        "operationId": "completeTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskId"],
                "properties": {
                  "taskId": { "type": "string", "description": "Task ID" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/delete": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Delete task",
        "description": "Permanently removes a task.",
        "operationId": "deleteTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskId"],
                "properties": {
                  "taskId": { "type": "string", "description": "Task ID to delete" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/assign": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Assign task",
        "description": "Assigns or unassigns a task to a team member.",
        "operationId": "assignTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskId"],
                "properties": {
                  "taskId": { "type": "string", "description": "Task ID" },
                  "assignedTo": { "type": "string", "description": "Member ID (omit to unassign)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/snooze": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Set reminder",
        "description": "Sets a reminder for a task.",
        "operationId": "snoozeTask",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskId", "snoozedUntil"],
                "properties": {
                  "taskId": { "type": "string", "description": "Task ID" },
                  "snoozedUntil": { "type": "number", "description": "Reminder date/time (timestamp ms)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/bulk": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Bulk operations",
        "description": "Executes bulk operations on multiple tasks (complete, delete, assign).",
        "operationId": "bulkTaskUpdate",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskIds", "action"],
                "properties": {
                  "taskIds": { "type": "array", "items": { "type": "string" }, "description": "Task IDs" },
                  "action": { "type": "string", "enum": ["complete", "delete", "assign"], "description": "Action a executar" },
                  "assignedTo": { "type": "string", "description": "Member ID (only for assign action)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/comments": {
      "get": {
        "tags": ["Tasks"],
        "summary": "List task comments",
        "description": "Returns comments for a task with pagination.",
        "operationId": "listTaskComments",
        "parameters": [
          { "name": "taskId", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Task ID" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "default": 200, "maximum": 500 }, "description": "Limite de resultados" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" }
        ],
        "responses": {
          "200": {
            "description": "List of comments",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "comments": { "type": "array", "items": { "$ref": "#/components/schemas/TaskComment" } },
                    "nextCursor": { "type": "string", "nullable": true },
                    "hasMore": { "type": "boolean" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/tasks/comments/add": {
      "post": {
        "tags": ["Tasks"],
        "summary": "Add comment",
        "description": "Adds a comment to a task.",
        "operationId": "addTaskComment",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["taskId", "content"],
                "properties": {
                  "taskId": { "type": "string", "description": "Task ID" },
                  "content": { "type": "string", "description": "Comment content" },
                  "mentionedUserIds": { "type": "array", "items": { "type": "string" }, "description": "Mentioned member IDs" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Comment added",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "commentId": { "type": "string", "description": "Created comment ID" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/audit-logs": {
      "get": {
        "tags": ["Audit"],
        "summary": "List audit logs",
        "description": "Returns organization audit logs with filters and cursor pagination.",
        "operationId": "listAuditLogs",
        "parameters": [
          { "name": "entityType", "in": "query", "schema": { "type": "string" }, "description": "Filter by entity type (e.g., lead, contact)" },
          { "name": "action", "in": "query", "schema": { "type": "string", "enum": ["create", "update", "delete", "move", "assign", "handoff"] }, "description": "Filter by action" },
          { "name": "severity", "in": "query", "schema": { "type": "string", "enum": ["low", "medium", "high", "critical"] }, "description": "Filter by severity" },
          { "name": "actorId", "in": "query", "schema": { "type": "string" }, "description": "Filter by actor ID" },
          { "name": "startDate", "in": "query", "schema": { "type": "number" }, "description": "Timestamp inicial (ms)" },
          { "name": "endDate", "in": "query", "schema": { "type": "number" }, "description": "Timestamp final (ms)" },
          { "name": "cursor", "in": "query", "schema": { "type": "string" }, "description": "Pagination cursor" },
          { "name": "limit", "in": "query", "schema": { "type": "integer", "maximum": 200 }, "description": "Limite de resultados" }
        ],
        "responses": {
          "200": {
            "description": "List of audit logs",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "logs": { "type": "array", "items": { "$ref": "#/components/schemas/AuditLog" } },
                    "nextCursor": { "type": "string", "description": "Cursor for the next page" },
                    "hasMore": { "type": "boolean", "description": "Indicates whether there are more results" }
                  }
                }
              }
            }
          },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events": {
      "get": {
        "tags": ["Calendar"],
        "summary": "List calendar events",
        "description": "Returns calendar events in a date range with optional filters. Can include tasks with due dates in range.",
        "operationId": "listCalendarEvents",
        "parameters": [
          { "name": "startDate", "in": "query", "required": true, "schema": { "type": "number" }, "description": "Interval start (timestamp ms)" },
          { "name": "endDate", "in": "query", "required": true, "schema": { "type": "number" }, "description": "Interval end (timestamp ms)" },
          { "name": "assignedTo", "in": "query", "schema": { "type": "string" }, "description": "Filter by assignee" },
          { "name": "eventType", "in": "query", "schema": { "type": "string", "enum": ["call", "meeting", "follow_up", "demo", "task", "reminder", "other"] }, "description": "Filter by event type" },
          { "name": "status", "in": "query", "schema": { "type": "string", "enum": ["scheduled", "completed", "cancelled"] }, "description": "Filter by status" },
          { "name": "leadId", "in": "query", "schema": { "type": "string" }, "description": "Filter by lead" },
          { "name": "contactId", "in": "query", "schema": { "type": "string" }, "description": "Filter by contact" },
          { "name": "includeTasks", "in": "query", "schema": { "type": "boolean", "default": true }, "description": "Include tasks with dueDate in range" }
        ],
        "responses": {
          "200": {
            "description": "List of events",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "events": { "type": "array", "items": { "$ref": "#/components/schemas/CalendarEvent" } }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events/get": {
      "get": {
        "tags": ["Calendar"],
        "summary": "Get event",
        "description": "Returns event data for a specific ID.",
        "operationId": "getCalendarEvent",
        "parameters": [
          { "name": "id", "in": "query", "required": true, "schema": { "type": "string" }, "description": "Event ID" }
        ],
        "responses": {
          "200": {
            "description": "Event data",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "event": { "$ref": "#/components/schemas/CalendarEvent" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "404": { "$ref": "#/components/responses/NotFound" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events/create": {
      "post": {
        "tags": ["Calendar"],
        "summary": "Create event",
        "description": "Creates a new event in the calendar.",
        "operationId": "createCalendarEvent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["title", "eventType", "startTime", "endTime"],
                "properties": {
                  "title": { "type": "string", "description": "Event title" },
                  "eventType": { "type": "string", "enum": ["call", "meeting", "follow_up", "demo", "task", "reminder", "other"], "description": "Event type" },
                  "startTime": { "type": "number", "description": "Start time (timestamp ms)" },
                  "endTime": { "type": "number", "description": "End time (timestamp ms)" },
                  "allDay": { "type": "boolean", "default": false, "description": "All-day event" },
                  "description": { "type": "string", "description": "Description" },
                  "leadId": { "type": "string", "description": "Associated lead ID" },
                  "contactId": { "type": "string", "description": "Associated contact ID" },
                  "assignedTo": { "type": "string", "description": "Assignee ID" },
                  "attendees": { "type": "array", "items": { "type": "string" }, "description": "Participant IDs" },
                  "location": { "type": "string", "description": "Location" },
                  "meetingUrl": { "type": "string", "description": "Meeting URL" },
                  "recurrence": { "type": "object", "properties": { "pattern": { "type": "string", "enum": ["daily", "weekly", "biweekly", "monthly"] }, "endDate": { "type": "number" } } },
                  "notes": { "type": "string", "description": "Notes" }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Event created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean", "const": true },
                    "eventId": { "type": "string", "description": "ID of created event" }
                  }
                }
              }
            }
          },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events/update": {
      "post": {
        "tags": ["Calendar"],
        "summary": "Update event",
        "description": "Updates fields of an existing event.",
        "operationId": "updateCalendarEvent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["eventId"],
                "properties": {
                  "eventId": { "type": "string", "description": "Event ID" },
                  "title": { "type": "string" },
                  "description": { "type": "string" },
                  "eventType": { "type": "string", "enum": ["call", "meeting", "follow_up", "demo", "task", "reminder", "other"] },
                  "startTime": { "type": "number" },
                  "endTime": { "type": "number" },
                  "allDay": { "type": "boolean" },
                  "location": { "type": "string" },
                  "meetingUrl": { "type": "string" },
                  "notes": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events/delete": {
      "post": {
        "tags": ["Calendar"],
        "summary": "Delete event",
        "description": "Removes a calendar event. Also deletes child recurring events.",
        "operationId": "deleteCalendarEvent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["eventId"],
                "properties": {
                  "eventId": { "type": "string", "description": "Event ID" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events/reschedule": {
      "post": {
        "tags": ["Calendar"],
        "summary": "Reschedule event",
        "description": "Reschedules an event to a new time. If newEndTime is not provided, the original duration is kept.",
        "operationId": "rescheduleCalendarEvent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["eventId", "newStartTime"],
                "properties": {
                  "eventId": { "type": "string", "description": "Event ID" },
                  "newStartTime": { "type": "number", "description": "New start (timestamp ms)" },
                  "newEndTime": { "type": "number", "description": "New end time (timestamp ms, optional)" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    },
    "/api/v1/calendar/events/complete": {
      "post": {
        "tags": ["Calendar"],
        "summary": "Complete event",
        "description": "Marks an event as completed. If the event recurs, automatically generates the next instance.",
        "operationId": "completeCalendarEvent",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["eventId"],
                "properties": {
                  "eventId": { "type": "string", "description": "Event ID" }
                }
              }
            }
          }
        },
        "responses": {
          "200": { "$ref": "#/components/responses/Success" },
          "400": { "$ref": "#/components/responses/BadRequest" },
          "401": { "$ref": "#/components/responses/Unauthorized" },
          "500": { "$ref": "#/components/responses/InternalError" }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "X-API-Key",
        "description": "API key linked to a team member and organization. The key is stored as a SHA-256 hash."
      }
    },
    "schemas": {
      "Lead": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique lead ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "title": { "type": "string", "description": "Lead title" },
          "contactId": { "type": "string", "description": "Associated contact ID" },
          "boardId": { "type": "string", "description": "Board ID (pipeline)" },
          "stageId": { "type": "string", "description": "Current stage ID" },
          "assignedTo": { "type": "string", "description": "Responsible member ID" },
          "value": { "type": "number", "description": "Monetary value" },
          "currency": { "type": "string", "description": "Currency code" },
          "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"], "description": "Prioridade" },
          "temperature": { "type": "string", "enum": ["cold", "warm", "hot"], "description": "Temperatura" },
          "sourceId": { "type": "string", "description": "Lead source ID" },
          "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags" },
          "customFields": { "type": "object", "additionalProperties": true, "description": "Campos personalizados" },
          "conversationStatus": { "type": "string", "enum": ["new", "active", "waiting", "closed"], "description": "Conversation status" },
          "closedAt": { "type": "number", "description": "Closing timestamp" },
          "closedType": { "type": "string", "enum": ["won", "lost"], "description": "Closing type" }
        }
      },
      "Contact": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique contact ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "firstName": { "type": "string", "description": "Primeiro nome" },
          "lastName": { "type": "string", "description": "Sobrenome" },
          "email": { "type": "string", "description": "Email" },
          "phone": { "type": "string", "description": "Phone" },
          "company": { "type": "string", "description": "Empresa" },
          "title": { "type": "string", "description": "Job title" },
          "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags" },
          "city": { "type": "string", "description": "City" },
          "state": { "type": "string", "description": "State" },
          "country": { "type": "string", "description": "Country" },
          "industry": { "type": "string", "description": "Industry" },
          "customFields": { "type": "object", "additionalProperties": true, "description": "Campos personalizados" }
        }
      },
      "Conversation": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique conversation ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "leadId": { "type": "string", "description": "Associated lead ID" },
          "channel": { "type": "string", "enum": ["whatsapp", "telegram", "email", "webchat", "internal"], "description": "Conversation channel" },
          "status": { "type": "string", "enum": ["active", "closed"], "description": "Conversation status" },
          "messageCount": { "type": "integer", "description": "Total messages" }
        }
      },
      "Message": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique message ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "conversationId": { "type": "string", "description": "Conversation ID" },
          "leadId": { "type": "string", "description": "Lead ID" },
          "direction": { "type": "string", "enum": ["inbound", "outbound", "internal"], "description": "Message direction" },
          "senderId": { "type": "string", "description": "Sender ID" },
          "senderType": { "type": "string", "enum": ["contact", "human", "ai"], "description": "Sender type" },
          "content": { "type": "string", "description": "Message content" },
          "contentType": { "type": "string", "enum": ["text", "image", "file", "audio"], "description": "Content type" },
          "isInternal": { "type": "boolean", "description": "Nota interna" }
        }
      },
      "Handoff": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique handoff ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "leadId": { "type": "string", "description": "Lead ID" },
          "fromMemberId": { "type": "string", "description": "Requester member ID" },
          "toMemberId": { "type": "string", "description": "Target member ID" },
          "reason": { "type": "string", "description": "Reason for handoff" },
          "summary": { "type": "string", "description": "Conversation summary" },
          "suggestedActions": { "type": "array", "items": { "type": "string" }, "description": "Suggested actions" },
          "status": { "type": "string", "enum": ["pending", "accepted", "rejected"], "description": "Handoff status" }
        }
      },
      "Board": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique board ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "name": { "type": "string", "description": "Board name" },
          "description": { "type": "string", "description": "Description" },
          "color": { "type": "string", "description": "Display color" },
          "isDefault": { "type": "boolean", "description": "Whether it is the default board for new leads" },
          "order": { "type": "integer", "description": "Display order" }
        }
      },
      "Stage": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique stage ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "boardId": { "type": "string", "description": "Parent board ID" },
          "name": { "type": "string", "description": "Stage name" },
          "color": { "type": "string", "description": "Display color" },
          "order": { "type": "integer", "description": "Display order" },
          "isClosedWon": { "type": "boolean", "description": "Marks as won stage" },
          "isClosedLost": { "type": "boolean", "description": "Marks as lost stage" }
        }
      },
      "TeamMember": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique member ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "name": { "type": "string", "description": "Display name" },
          "email": { "type": "string", "description": "Email (humans)" },
          "role": { "type": "string", "enum": ["admin", "manager", "agent", "ai"], "description": "Role in the team" },
          "type": { "type": "string", "enum": ["human", "ai"], "description": "Member type" },
          "status": { "type": "string", "enum": ["active", "inactive", "busy"], "description": "Status atual" },
          "capabilities": { "type": "array", "items": { "type": "string" }, "description": "Member capabilities" },
          "permissions": { "type": "object", "nullable": true, "description": "Granular RBAC permissions (9 categories). Null = use role defaults" },
          "mustChangePassword": { "type": "boolean", "description": "Forces password change on next login" },
          "invitedBy": { "type": "string", "nullable": true, "description": "Inviting member ID" }
        }
      },
      "FieldDefinition": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique definition ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "name": { "type": "string", "description": "Display name" },
          "key": { "type": "string", "description": "Unique storage key" },
          "type": { "type": "string", "enum": ["text", "number", "boolean", "date", "select", "multiselect"], "description": "Field type" },
          "entityType": { "type": "string", "enum": ["lead", "contact"], "description": "Entity type (null = both)" },
          "options": { "type": "array", "items": { "type": "string" }, "description": "Options for select/multiselect" },
          "isRequired": { "type": "boolean", "description": "Whether the field is required" },
          "order": { "type": "integer", "description": "Display order" }
        }
      },
      "Activity": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique activity ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "leadId": { "type": "string", "description": "Lead ID" },
          "type": { "type": "string", "description": "Activity type" },
          "actorId": { "type": "string", "description": "Actor ID" },
          "actorType": { "type": "string", "enum": ["human", "ai", "system"], "description": "Actor type" },
          "content": { "type": "string", "description": "Activity content" },
          "metadata": { "type": "object", "additionalProperties": true, "description": "Metadados adicionais" },
          "createdAt": { "type": "number", "description": "Creation timestamp" }
        }
      },
      "LeadSource": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique source ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "name": { "type": "string", "description": "Source name" },
          "type": { "type": "string", "enum": ["website", "social", "email", "phone", "referral", "api", "other"], "description": "Source type" },
          "isActive": { "type": "boolean", "description": "Whether it is active" }
        }
      },
      "Task": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique task ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "title": { "type": "string", "description": "Task title" },
          "description": { "type": "string", "description": "Description detalhada" },
          "type": { "type": "string", "enum": ["task", "reminder"], "description": "Type" },
          "status": { "type": "string", "enum": ["pending", "in_progress", "completed", "cancelled"], "description": "Status" },
          "priority": { "type": "string", "enum": ["low", "medium", "high", "urgent"], "description": "Prioridade" },
          "activityType": { "type": "string", "enum": ["todo", "call", "email", "follow_up", "meeting", "research"], "description": "CRM activity type" },
          "dueDate": { "type": "number", "description": "Due date (timestamp ms)" },
          "completedAt": { "type": "number", "description": "Completion timestamp" },
          "snoozedUntil": { "type": "number", "description": "Snoozed until (timestamp ms)" },
          "leadId": { "type": "string", "description": "Associated lead ID" },
          "contactId": { "type": "string", "description": "Associated contact ID" },
          "assignedTo": { "type": "string", "description": "Responsible member ID" },
          "createdBy": { "type": "string", "description": "Creator ID" },
          "recurrence": {
            "type": "object",
            "properties": {
              "pattern": { "type": "string", "enum": ["daily", "weekly", "biweekly", "monthly"] },
              "endDate": { "type": "number" }
            }
          },
          "checklist": { "type": "array", "items": { "type": "object", "properties": { "id": { "type": "string" }, "title": { "type": "string" }, "completed": { "type": "boolean" } } } },
          "tags": { "type": "array", "items": { "type": "string" }, "description": "Tags" }
        }
      },
      "TaskComment": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique comment ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "taskId": { "type": "string", "description": "Task ID" },
          "authorId": { "type": "string", "description": "Author ID" },
          "authorType": { "type": "string", "enum": ["human", "ai"], "description": "Author type" },
          "content": { "type": "string", "description": "Comment content" },
          "mentionedUserIds": { "type": "array", "items": { "type": "string" }, "description": "IDs mencionados" }
        }
      },
      "CalendarEvent": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique event ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "title": { "type": "string", "description": "Event title" },
          "description": { "type": "string", "description": "Description" },
          "eventType": { "type": "string", "enum": ["call", "meeting", "follow_up", "demo", "task", "reminder", "other"], "description": "Event type" },
          "startTime": { "type": "number", "description": "Start time (timestamp ms)" },
          "endTime": { "type": "number", "description": "End time (timestamp ms)" },
          "allDay": { "type": "boolean", "description": "All-day event" },
          "status": { "type": "string", "enum": ["scheduled", "completed", "cancelled"], "description": "Event status" },
          "leadId": { "type": "string", "description": "Associated lead ID" },
          "contactId": { "type": "string", "description": "Associated contact ID" },
          "taskId": { "type": "string", "description": "Linked task ID" },
          "attendees": { "type": "array", "items": { "type": "string" }, "description": "Participant IDs" },
          "createdBy": { "type": "string", "description": "Creator ID" },
          "assignedTo": { "type": "string", "description": "Assignee ID" },
          "location": { "type": "string", "description": "Location" },
          "meetingUrl": { "type": "string", "description": "Meeting URL" },
          "color": { "type": "string", "description": "Color customizada" },
          "recurrence": { "type": "object", "properties": { "pattern": { "type": "string", "enum": ["daily", "weekly", "biweekly", "monthly"] }, "endDate": { "type": "number" } } },
          "parentEventId": { "type": "string", "description": "Parent event ID (recurrence)" },
          "notes": { "type": "string", "description": "Notes adicionais" },
          "createdAt": { "type": "number", "description": "Creation timestamp" },
          "updatedAt": { "type": "number", "description": "Update timestamp" }
        }
      },
      "AuditLog": {
        "type": "object",
        "properties": {
          "_id": { "type": "string", "description": "Unique log ID" },
          "_creationTime": { "type": "number", "description": "Creation timestamp" },
          "organizationId": { "type": "string", "description": "Organization ID" },
          "entityType": { "type": "string", "description": "Entity type (e.g., lead, contact)" },
          "entityId": { "type": "string", "description": "Entity ID" },
          "action": { "type": "string", "enum": ["create", "update", "delete", "move", "assign", "handoff"], "description": "Action realizada" },
          "actorId": { "type": "string", "description": "Actor ID" },
          "actorType": { "type": "string", "enum": ["human", "ai", "system"], "description": "Actor type" },
          "changes": {
            "type": "object",
            "properties": {
              "before": { "type": "object", "additionalProperties": true, "description": "Previous state" },
              "after": { "type": "object", "additionalProperties": true, "description": "Current state" }
            },
            "description": "Changes made"
          },
          "description": { "type": "string", "description": "Readable action description" },
          "severity": { "type": "string", "enum": ["low", "medium", "high", "critical"], "description": "Severidade" },
          "createdAt": { "type": "number", "description": "Creation timestamp" }
        }
      }
    },
    "responses": {
      "Success": {
        "description": "Operation completed successfully",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "success": { "type": "boolean", "const": true }
              }
            }
          }
        }
      },
      "BadRequest": {
        "description": "Invalid request — missing or invalid required parameters",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "error": { "type": "string", "description": "Error message" },
                "code": { "type": "integer", "example": 400 }
              }
            }
          }
        }
      },
      "Unauthorized": {
        "description": "Unauthorized — missing or invalid API key",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "error": { "type": "string", "description": "Error message" },
                "code": { "type": "integer", "example": 401 }
              }
            }
          }
        }
      },
      "NotFound": {
        "description": "Resource not found",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "error": { "type": "string", "description": "Error message" },
                "code": { "type": "integer", "example": 404 }
              }
            }
          }
        }
      },
      "InternalError": {
        "description": "Internal server error",
        "content": {
          "application/json": {
            "schema": {
              "type": "object",
              "properties": {
                "error": { "type": "string", "description": "Error message" },
                "code": { "type": "integer", "example": 500 }
              }
            }
          }
        }
      }
    }
  }
}`;
