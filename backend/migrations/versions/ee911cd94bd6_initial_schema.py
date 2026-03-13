"""Initial schema

Revision ID: ee911cd94bd6
Revises: 
Create Date: 2026-03-13 15:33:19.545928

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


from geoalchemy2 import Geometry

# revision identifiers, used by Alembic.
revision: str = 'ee911cd94bd6'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create PostGIS extension
    op.execute('CREATE EXTENSION IF NOT EXISTS postgis')

    # Departments
    op.create_table(
        'departments',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('ministry', sa.String(), nullable=True),
        sa.Column('state', sa.String(), nullable=True),
        sa.Column('dept_code', sa.String(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('dept_code')
    )
    op.create_index(op.f('ix_departments_id'), 'departments', ['id'], unique=False)

    # Zones
    op.create_table(
        'zones',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('dept_id', sa.Integer(), nullable=True),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('boundary', Geometry(geometry_type='POLYGON', srid=4326, from_text='ST_GeomFromEWKT', name='geometry'), nullable=True),
        sa.Column('city', sa.String(), nullable=True),
        sa.Column('district', sa.String(), nullable=True),
        sa.ForeignKeyConstraint(['dept_id'], ['departments.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_zones_id'), 'zones', ['id'], unique=False)

    # Employees
    op.create_table(
        'employees',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('govt_id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.Column('dept_id', sa.Integer(), nullable=True),
        sa.Column('zone_id', sa.Integer(), nullable=True),
        sa.Column('employee_type', sa.String(), nullable=True),
        sa.Column('job_role', sa.String(), nullable=True),
        sa.Column('category', sa.String(), nullable=True),
        sa.Column('pin_hash', sa.String(), nullable=True),
        sa.Column('face_embedding_hash', sa.LargeBinary(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('updated_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['dept_id'], ['departments.id'], ),
        sa.ForeignKeyConstraint(['zone_id'], ['zones.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_employees_govt_id'), 'employees', ['govt_id'], unique=True)

    # Attendance
    op.create_table(
        'attendance',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('employee_id', sa.UUID(), nullable=True),
        sa.Column('date', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('checkin_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('checkout_time', sa.DateTime(timezone=True), nullable=True),
        sa.Column('checkin_lat', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('checkin_lon', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('streak_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Work Submissions
    op.create_table(
        'work_submissions',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('employee_id', sa.UUID(), nullable=True),
        sa.Column('task_type', sa.String(), nullable=False),
        sa.Column('before_image_url', sa.String(), nullable=True),
        sa.Column('after_image_url', sa.String(), nullable=True),
        sa.Column('latitude', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('longitude', sa.Numeric(precision=9, scale=6), nullable=True),
        sa.Column('submitted_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.Column('ai_confidence', sa.Numeric(precision=4, scale=3), nullable=True),
        sa.Column('ai_quality_score', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('fraud_risk_score', sa.Numeric(precision=4, scale=3), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Daily Scores
    op.create_table(
        'daily_scores',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('employee_id', sa.UUID(), nullable=True),
        sa.Column('date', sa.DateTime(), server_default=sa.text('now()'), nullable=True),
        sa.Column('attendance_score', sa.Float(), nullable=True),
        sa.Column('work_score', sa.Float(), nullable=True),
        sa.Column('quality_score', sa.Float(), nullable=True),
        sa.Column('bonus_score', sa.Float(), nullable=True),
        sa.Column('fraud_penalty', sa.Float(), nullable=True),
        sa.Column('total_score', sa.Float(), nullable=True),
        sa.Column('tier', sa.String(), nullable=True),
        sa.Column('scoring_version', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Monthly Scores
    op.create_table(
        'monthly_scores',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('employee_id', sa.UUID(), nullable=True),
        sa.Column('month', sa.Integer(), nullable=True),
        sa.Column('year', sa.Integer(), nullable=True),
        sa.Column('total_score', sa.Float(), nullable=True),
        sa.Column('avg_quality_score', sa.Float(), nullable=True),
        sa.Column('reward_eligible', sa.Boolean(), nullable=True),
        sa.Column('fraud_flag_count', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Rewards
    op.create_table(
        'rewards',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('employee_id', sa.UUID(), nullable=True),
        sa.Column('type', sa.String(), nullable=True),
        sa.Column('amount', sa.Numeric(precision=12, scale=2), nullable=True),
        sa.Column('trigger', sa.String(), nullable=True),
        sa.Column('ai_justification', sa.String(), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('payment_ref', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['employee_id'], ['employees.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Fraud Flags
    op.create_table(
        'fraud_flags',
        sa.Column('id', sa.UUID(), nullable=False),
        sa.Column('submission_id', sa.UUID(), nullable=True),
        sa.Column('flag_type', sa.String(), nullable=True),
        sa.Column('risk_score', sa.Numeric(precision=4, scale=3), nullable=True),
        sa.Column('evidence', sa.dialects.postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('status', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.ForeignKeyConstraint(['submission_id'], ['work_submissions.id'], ),
        sa.PrimaryKeyConstraint('id')
    )

    # Audit Log
    op.create_table(
        'audit_log',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('entity_type', sa.String(), nullable=True),
        sa.Column('entity_id', sa.String(), nullable=True),
        sa.Column('action', sa.String(), nullable=True),
        sa.Column('actor_id', sa.String(), nullable=True),
        sa.Column('prev_state', sa.dialects.postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('new_state', sa.dialects.postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column('checksum', sa.String(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('now()'), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_audit_log_id'), 'audit_log', ['id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_audit_log_id'), table_name='audit_log')
    op.drop_table('audit_log')
    op.drop_table('fraud_flags')
    op.drop_table('rewards')
    op.drop_table('monthly_scores')
    op.drop_table('daily_scores')
    op.drop_table('work_submissions')
    op.drop_table('attendance')
    op.drop_index(op.f('ix_employees_govt_id'), table_name='employees')
    op.drop_table('employees')
    op.drop_index(op.f('ix_zones_id'), table_name='zones')
    op.drop_table('zones')
    op.drop_index(op.f('ix_departments_id'), table_name='departments')
    op.drop_table('departments')
    op.execute('DROP EXTENSION IF EXISTS postgis')
